import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useApproveAndStake, useStakeData } from "../hooks/useStake";
import { useClaimRewards, useEmergencyWithdraw, useWithdraw } from "../hooks/useWithdraw";

const Section = ({ title, children }) => (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>{title}</h3>
        {children}
    </div>
);

export default function StakeDashboard() {
    const { isConnected } = useAccount();
    const data = useStakeData();
    const { approve, stake, isPending: isStakePending, step } = useApproveAndStake();
    const { withdraw, isPending: isWithdrawPending } = useWithdraw();
    const { claim, isPending: isClaimPending } = useClaimRewards();
    const { emergencyWithdraw, isPending: isEmergencyPending } = useEmergencyWithdraw();

    const [amount, setAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    return (
        <div style={{ maxWidth: 800, margin: "24px auto", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Staking dApp</h2>
                <ConnectButton />
            </div>

            <Section title="Protocol Stats">
                <div>Current APR: {data.currentAPR}</div>
                <div>Total Staked: {data.totalStaked}</div>
            </Section>

            <Section title="Your Position">
                {isConnected ? (
                    <>
                        <div>Staked Amount: {data.user?.stakedAmount || "0"}</div>
                        <div>Pending Rewards: {data.pendingRewards}</div>
                        <div>Time Until Unlock (s): {data.timeUntilUnlock}</div>
                    </>
                ) : (
                    <div>Please connect your wallet.</div>
                )}
            </Section>

            <Section title="Stake">
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ flex: 1, padding: 8 }}
                    />
                    <button disabled={!isConnected || !amount || isStakePending} onClick={() => approve(amount)}>
                        {step === "approving" ? "Approving..." : "Approve"}
                    </button>
                    <button disabled={!isConnected || !amount || isStakePending} onClick={() => stake(amount)}>
                        {step === "staking" ? "Staking..." : "Stake"}
                    </button>
                </div>
            </Section>

            <Section title="Withdraw">
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        placeholder="Amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        style={{ flex: 1, padding: 8 }}
                    />
                    <button disabled={!isConnected || !withdrawAmount || isWithdrawPending} onClick={() => withdraw(withdrawAmount)}>
                        Withdraw
                    </button>
                </div>
            </Section>

            <Section title="Rewards">
                <div style={{ display: "flex", gap: 8 }}>
                    <button disabled={!isConnected || isClaimPending} onClick={() => claim()}>Claim Rewards</button>
                    <button disabled={!isConnected || isEmergencyPending} onClick={() => emergencyWithdraw()}>
                        Emergency Withdraw
                    </button>
                </div>
            </Section>
        </div>
    );
}


