//! Acre Distribution Contract
//! Accepts stablecoin rent deposits and distributes yield pro-rata to token holders.
//! Flow: admin deposits rent → snapshot total supply → holders claim their share.

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
pub enum DataKey {
    Admin,
    TokenContract,
    StablecoinContract,
    TotalDeposited,
    Claimed(Address),
    SnapshotSupply,
}

#[contract]
pub struct DistributionContract;

#[contractimpl]
impl DistributionContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        token_contract: Address,
        stablecoin_contract: Address,
    ) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TokenContract, &token_contract);
        env.storage().instance().set(&DataKey::StablecoinContract, &stablecoin_contract);
        env.storage().instance().set(&DataKey::TotalDeposited, &0_i128);
    }

    /// Admin deposits rent (stablecoin). Snapshots total token supply for pro-rata calc.
    pub fn deposit_rent(env: Env, amount: i128, total_token_supply: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        assert!(amount > 0 && total_token_supply > 0);

        let stablecoin: Address = env.storage().instance().get(&DataKey::StablecoinContract).unwrap();
        token::Client::new(&env, &stablecoin).transfer(&admin, &env.current_contract_address(), &amount);

        let prev: i128 = env.storage().instance().get(&DataKey::TotalDeposited).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalDeposited, &(prev + amount));
        env.storage().instance().set(&DataKey::SnapshotSupply, &total_token_supply);

        env.events().publish((soroban_sdk::Symbol::new(&env, "rent_deposited"),), amount);
    }

    /// Token holder claims their pro-rata share of deposited rent.
    pub fn claim(env: Env, holder: Address, holder_balance: i128) {
        holder.require_auth();
        let total_deposited: i128 = env.storage().instance().get(&DataKey::TotalDeposited).unwrap_or(0);
        let snapshot_supply: i128 = env.storage().instance().get(&DataKey::SnapshotSupply).unwrap_or(1);
        let already_claimed: i128 = env.storage().instance().get(&DataKey::Claimed(holder.clone())).unwrap_or(0);

        let entitled = (holder_balance * total_deposited) / snapshot_supply;
        let claimable = entitled - already_claimed;
        assert!(claimable > 0, "nothing to claim");

        let stablecoin: Address = env.storage().instance().get(&DataKey::StablecoinContract).unwrap();
        token::Client::new(&env, &stablecoin).transfer(&env.current_contract_address(), &holder, &claimable);

        env.storage().instance().set(&DataKey::Claimed(holder.clone()), &entitled);
        env.events().publish((soroban_sdk::Symbol::new(&env, "yield_claimed"),), claimable);
    }

    pub fn claimable(env: Env, holder: Address, holder_balance: i128) -> i128 {
        let total_deposited: i128 = env.storage().instance().get(&DataKey::TotalDeposited).unwrap_or(0);
        let snapshot_supply: i128 = env.storage().instance().get(&DataKey::SnapshotSupply).unwrap_or(1);
        let already_claimed: i128 = env.storage().instance().get(&DataKey::Claimed(holder)).unwrap_or(0);
        let entitled = (holder_balance * total_deposited) / snapshot_supply;
        (entitled - already_claimed).max(0)
    }
}
