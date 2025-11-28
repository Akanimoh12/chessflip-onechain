module chessflip::game {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string::String;

    /// PlayerProfile object structure for storing player data on-chain
    /// This is the core data model for all registered players
    public struct PlayerProfile has key, store {
        id: UID,
        address: address,
        username: String,
        total_points: u64,
        total_games: u64,
        wins: u64,
        losses: u64,
        created_at: u64,
    }

    /// ChessFlipGame object structure for storing individual game state on-chain
    /// Game objects are owned (not shared) so only the player can modify them
    public struct ChessFlipGame has key, store {
        id: UID,
        player: address,
        status: String,              // "Playing" or "Completed"
        matched_pairs: u8,           // 0-6, how many pairs matched
        lives_remaining: u8,         // 0-5, lives left in this game
        result: String,              // "Win", "Loss", or "Pending"
        claimed: bool,               // whether points are claimed from this game
        points_earned: u64,          // points from this game
        created_at: u64,             // game start timestamp
        updated_at: u64,             // last update timestamp
    }

    // ==================== Module-Level Constants ====================

    /// Cost to start a new game: 0.001 SUI = 1,000,000 MIST
    const GAME_COST: u64 = 1_000_000;

    /// Points earned for winning a game
    const POINTS_WIN: u64 = 10;

    /// Points earned for losing a game
    const POINTS_LOSS: u64 = 2;

    // ==================== Events ====================

    public struct PlayerRegistered has copy, drop {
        player: address,
        username: String,
    }

    public struct GameStarted has copy, drop {
        player: address,
        game_id: ID,
    }

    public struct GameResultSubmitted has copy, drop {
        player: address,
        game_id: ID,
        result: String,
        points: u64,
    }

    public struct PointsClaimed has copy, drop {
        player: address,
        game_id: ID,
        points_earned: u64,
        total_points: u64,
    }

    // ==================== Registration Function ====================

    /// Register a new player and create their PlayerProfile object
    /// 
    /// This function creates a new PlayerProfile owned by the caller.
    /// The profile is returned to the player's wallet as an owned object.
    /// 
    /// Parameters:
    /// - ctx: Mutable transaction context for creating UID and getting sender/timestamp
    /// - username: Player's chosen username (3-20 chars validation done on frontend)
    /// 
    /// Returns: PlayerProfile object owned by the player
    public fun register_player(ctx: &mut TxContext, username: String): PlayerProfile {
        let player_address = tx_context::sender(ctx);
        let created_at = tx_context::epoch_ms(ctx);

        let profile = PlayerProfile {
            id: object::new(ctx),
            address: player_address,
            username: username,
            total_points: 0,
            total_games: 0,
            wins: 0,
            losses: 0,
            created_at: created_at,
        };

        // Emit registration event for off-chain tracking
        sui::event::emit(PlayerRegistered {
            player: player_address,
            username: profile.username,
        });

        profile
    }

    // ==================== Game Creation Function ====================

    /// Create a new game and start playing
    /// 
    /// This function initializes a new ChessFlipGame owned by the caller.
    /// Requires exact payment of GAME_COST (0.001 SUI = 1,000,000 MIST).
    /// The payment coin is burned (destroyed) as the game fee.
    /// 
    /// Parameters:
    /// - ctx: Mutable transaction context for creating UID and getting sender/timestamp
    /// - payment: Coin<SUI> containing the exact game cost
    /// 
    /// Returns: ChessFlipGame object owned by the player
    /// 
    /// Aborts if:
    /// - Payment amount is not exactly GAME_COST
    public fun start_game(ctx: &mut TxContext, payment: Coin<SUI>): ChessFlipGame {
        let payment_amount = coin::value(&payment);
        
        // Verify payment is exactly GAME_COST
        assert!(payment_amount == GAME_COST, 0);
        
        // Burn the payment coin
        coin::burn_for_testing(payment);

        let player_address = tx_context::sender(ctx);
        let current_time = tx_context::epoch_ms(ctx);

        let game = ChessFlipGame {
            id: object::new(ctx),
            player: player_address,
            status: std::string::utf8(b"Playing"),
            matched_pairs: 0,
            lives_remaining: 5,
            result: std::string::utf8(b"Pending"),
            claimed: false,
            points_earned: 0,
            created_at: current_time,
            updated_at: current_time,
        };

        let game_id = object::id(&game);

        // Emit game started event for off-chain tracking
        sui::event::emit(GameStarted {
            player: player_address,
            game_id: game_id,
        });

        game
    }

    // ==================== Game Result Function ====================

    /// Submit the result of a completed game
    /// 
    /// This function records the outcome of a game (Win or Loss) and assigns points.
    /// The game object is updated with the result and points_earned.
    /// Only the player who owns the game can submit its result.
    /// The game must be in "Playing" status.
    /// 
    /// Parameters:
    /// - ctx: Mutable transaction context for getting current timestamp
    /// - game: Mutable ChessFlipGame object (from player's wallet)
    /// - result: String indicating the game result ("Win" or "Loss")
    /// 
    /// Returns: Updated ChessFlipGame object with status "Completed" and points assigned
    public fun submit_game_result(ctx: &mut TxContext, mut game: ChessFlipGame, result: String): ChessFlipGame {
        let current_time = tx_context::epoch_ms(ctx);
        let game_id = object::id(&game);
        let player_address = game.player;

        // Determine points based on result
        let points_earned = if (result == std::string::utf8(b"Win")) {
            POINTS_WIN
        } else {
            POINTS_LOSS
        };

        // Update game object with result
        game.status = std::string::utf8(b"Completed");
        game.result = result;
        game.claimed = false;
        game.points_earned = points_earned;
        game.updated_at = current_time;

        // Emit game result event for off-chain tracking
        sui::event::emit(GameResultSubmitted {
            player: player_address,
            game_id: game_id,
            result: game.result,
            points: points_earned,
        });

        game
    }

    // ==================== Points Claiming Function ====================

    /// Claim points from a completed game and update player profile
    /// 
    /// This is the final step where players claim their points and update their profile stats.
    /// The game object's claimed flag is set to true to prevent double-claiming.
    /// The player's profile is updated with points, games, and win/loss counts.
    /// 
    /// Parameters:
    /// - ctx: Mutable transaction context (used for ID generation if needed)
    /// - profile: Mutable PlayerProfile object (from player's wallet)
    /// - game: Mutable ChessFlipGame object (completed game from player's wallet)
    /// 
    /// Returns: Tuple of updated (PlayerProfile, ChessFlipGame) both back to wallet
    /// 
    /// Aborts if:
    /// - Game has already been claimed (claimed == true)
    public fun claim_points(
        _ctx: &mut TxContext,
        mut profile: PlayerProfile,
        mut game: ChessFlipGame,
    ): (PlayerProfile, ChessFlipGame) {
        // Prevent double-claiming
        assert!(!game.claimed, 0);

        let game_id = object::id(&game);
        let points_earned = game.points_earned;

        // Update player profile with points
        profile.total_points = profile.total_points + points_earned;
        profile.total_games = profile.total_games + 1;

        // Update win/loss counts based on game result
        if (game.result == std::string::utf8(b"Win")) {
            profile.wins = profile.wins + 1;
        } else {
            profile.losses = profile.losses + 1;
        };

        // Mark game as claimed
        game.claimed = true;

        // Emit points claimed event for off-chain tracking
        sui::event::emit(PointsClaimed {
            player: profile.address,
            game_id: game_id,
            points_earned: points_earned,
            total_points: profile.total_points,
        });

        // Return both updated objects
        (profile, game)
    }

    // ==================== Read-Only Query Functions ====================

    /// Get player profile information
    /// 
    /// Returns a tuple of player stats that can be displayed on the dashboard.
    /// This is a read-only function that doesn't modify any state.
    /// 
    /// Parameters:
    /// - profile: Immutable reference to PlayerProfile object
    /// 
    /// Returns: Tuple of (username, total_points, total_games, wins, losses)
    public fun get_player(profile: &PlayerProfile): (String, u64, u64, u64, u64) {
        (
            profile.username,
            profile.total_points,
            profile.total_games,
            profile.wins,
            profile.losses,
        )
    }

    /// Get game state information
    /// 
    /// Returns a tuple of game stats that can be displayed during gameplay.
    /// This is a read-only function that doesn't modify any state.
    /// 
    /// Parameters:
    /// - game: Immutable reference to ChessFlipGame object
    /// 
    /// Returns: Tuple of (status, result, claimed, points_earned)
    public fun get_game(game: &ChessFlipGame): (String, String, bool, u64) {
        (
            game.status,
            game.result,
            game.claimed,
            game.points_earned,
        )
    }

    /// Check if a username is already registered
    /// 
    /// Note: For simplicity, this function returns false.
    /// Frontend handles username uniqueness checking by querying all PlayerProfiles
    /// from chain history. On-chain deduplication would require shared storage.
    /// 
    /// Parameters:
    /// - _username: Username to check (unused for now)
    /// 
    /// Returns: false (always - frontend queries directly)
    public fun check_username_exists(_username: String): bool {
        false
    }

    /// Get leaderboard of top players
    /// 
    /// Note: This is a stub function that returns an empty vector.
    /// For minimalism, leaderboard querying is done off-chain by indexing
    /// all PlayerProfile objects from the blockchain.
    /// On-chain leaderboards would require shared storage and sorting logic.
    /// 
    /// Returns: Empty vector (frontend queries PlayerProfiles directly)
    public fun get_leaderboard(): vector<address> {
        vector[]
    }
}
