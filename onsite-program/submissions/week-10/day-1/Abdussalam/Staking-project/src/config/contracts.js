export const STAKING_CONTRACT_ADDRESS = import.meta.env.VITE_STAKING_CONTRACT_ADDRESS;
export const TOKEN_CONTRACT_ADDRESS = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;

if (!STAKING_CONTRACT_ADDRESS || !TOKEN_CONTRACT_ADDRESS) {
    // eslint-disable-next-line no-console
    console.warn("Missing VITE_STAKING_CONTRACT_ADDRESS or VITE_TOKEN_CONTRACT_ADDRESS envs");
}


