import { useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { STAKING_TOKEN_ABI, VITE_STAKING__CONTRACT } from "../config/ABI";
import { STAKING_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../config/contracts";

export function useStakeData() {
    const { address } = useAccount();

    const { data: totalStaked } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: VITE_STAKING__CONTRACT,
        functionName: "totalStaked",
    });

    const { data: currentAPR } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: VITE_STAKING__CONTRACT,
        functionName: "currentRewardRate",
    });

    const { data: initialApr } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: VITE_STAKING__CONTRACT,
        functionName: "initialApr",
    });

    const { data: userDetails } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: VITE_STAKING__CONTRACT,
        functionName: "getUserDetails",
        args: address ? [address] : undefined,
        query: { enabled: Boolean(address) },
    });

    const { data: pendingRewards } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: VITE_STAKING__CONTRACT,
        functionName: "getPendingRewards",
        args: address ? [address] : undefined,
        query: { enabled: Boolean(address) },
    });

    const { data: timeUntilUnlock } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: VITE_STAKING__CONTRACT,
        functionName: "getTimeUntilUnlock",
        args: address ? [address] : undefined,
        query: { enabled: Boolean(address) },
    });

    const { data: tokenDecimals = 18n } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: STAKING_TOKEN_ABI,
        functionName: "decimals",
    });

    const formatted = useMemo(() => {
        const decimals = Number(tokenDecimals ?? 18n);
        return {
            totalStaked: totalStaked ? formatUnits(totalStaked, decimals) : "0",
            currentAPR: currentAPR ? String(currentAPR) : initialApr ? String(initialApr) : "0",
            pendingRewards: pendingRewards ? formatUnits(pendingRewards, decimals) : "0",
            timeUntilUnlock: timeUntilUnlock ? Number(timeUntilUnlock) : 0,
            user: userDetails
                ? {
                      stakedAmount: formatUnits(userDetails.stakedAmount ?? 0n, decimals),
                      lastStakeTimestamp: Number(userDetails.lastStakeTimestamp ?? 0n),
                      pendingRewards: formatUnits(userDetails.pendingRewards ?? 0n, decimals),
                      timeUntilUnlock: Number(userDetails.timeUntilUnlock ?? 0n),
                      canWithdraw: Boolean(userDetails.canWithdraw),
                  }
                : null,
        };
    }, [tokenDecimals, totalStaked, currentAPR, initialApr, pendingRewards, timeUntilUnlock, userDetails]);

    return formatted;
}

export function useApproveAndStake() {
    const { address } = useAccount();
    const { writeContract, data: txHash, isPending, error } = useWriteContract();
    const [step, setStep] = useState("idle");
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

    const approve = async (amount, decimals = 18) => {
        setStep("approving");
        const value = parseUnits(String(amount || 0), decimals);
        return writeContract({
            address: TOKEN_CONTRACT_ADDRESS,
            abi: STAKING_TOKEN_ABI,
            functionName: "approve",
            args: [STAKING_CONTRACT_ADDRESS, value],
        });
    };

    const stake = async (amount, decimals = 18) => {
        setStep("staking");
        const value = parseUnits(String(amount || 0), decimals);
        return writeContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: VITE_STAKING__CONTRACT,
            functionName: "stake",
            args: [value],
        });
    };

    return { approve, stake, step, isPending: isPending || isConfirming, isSuccess, error, txHash };
}


