//! Acre Vault Contract — registers an RWA and links to token + distribution contracts.

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct VaultInfo {
    pub asset_id: String,
    pub asset_value: i128,      // USD cents
    pub total_tokens: i128,
    pub token_contract: Address,
    pub distribution_contract: Address,
    pub spv_address: String,
    pub admin: Address,
}

#[contracttype]
pub enum DataKey {
    Vault,
    Initialized,
}

#[contract]
pub struct VaultContract;

#[contractimpl]
impl VaultContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        asset_id: String,
        asset_value: i128,
        total_tokens: i128,
        token_contract: Address,
        distribution_contract: Address,
        spv_address: String,
    ) {
        // Auth before any state reads to avoid leaking initialization status
        admin.require_auth();
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("already initialized");
        }

        env.storage().instance().set(&DataKey::Vault, &VaultInfo {
            asset_id: asset_id.clone(),
            asset_value,
            total_tokens,
            token_contract,
            distribution_contract,
            spv_address,
            admin,
        });
        env.storage().instance().set(&DataKey::Initialized, &true);
        env.events().publish((Symbol::new(&env, "vault_created"),), asset_id);
    }

    pub fn get_vault(env: Env) -> VaultInfo {
        env.storage().instance().get(&DataKey::Vault).unwrap()
    }

    pub fn update_valuation(env: Env, new_value: i128) {
        let mut vault: VaultInfo = env.storage().instance().get(&DataKey::Vault).unwrap();
        vault.admin.require_auth();
        vault.asset_value = new_value;
        env.storage().instance().set(&DataKey::Vault, &vault);
        env.events().publish((Symbol::new(&env, "valuation_updated"),), new_value);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, VaultContract);
        let client = VaultContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);
        let dist = Address::generate(&env);

        client.initialize(
            &admin,
            &String::from_str(&env, "WAREHOUSE-NYC-001"),
            &100_000_000_i128,
            &1_000_000_i128,
            &token,
            &dist,
            &String::from_str(&env, "SPV-NYC-001"),
        );

        let vault = client.get_vault();
        assert_eq!(vault.total_tokens, 1_000_000);
    }
}
