import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VITE_STAKING__CONTRACT } from "../config/ABI";
import { STAKING_CONTRACT_ADDRESS } from "../config/contracts";
import { parseUnits } from "viem";

export function useWithdraw() {
    const { writeContract, data: txHash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

    const withdraw = async (amount, decimals = 18) => {
        const value = parseUnits(String(amount || 0), decimals);
        return writeContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: VITE_STAKING__CONTRACT,
            functionName: "withdraw",
            args: [value],
        });
    };

    return { withdraw, txHash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useClaimRewards() {
    const { writeContract, data: txHash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

    const claim = async () =>
        writeContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: VITE_STAKING__CONTRACT,
            functionName: "claimRewards",
        });

    return { claim, txHash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useEmergencyWithdraw() {
    const { writeContract, data: txHash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

    const emergencyWithdraw = async () =>
        writeContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: VITE_STAKING__CONTRACT,
            functionName: "emergencyWithdraw",
        });

    return { emergencyWithdraw, txHash, isPending: isPending || isConfirming, isSuccess, error };
}


