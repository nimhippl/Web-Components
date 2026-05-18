function createRewardCardElement(rewardData) {
    const rewardCard = document.createElement('gwc-reward-card');

    rewardCard.setAttribute('show-description', 'true');
    rewardCard.setAttribute('show-rarity', 'true');
    rewardCard.setAttribute('show-amount', 'true');
    rewardCard.setAttribute('show-state-label', 'true');
    rewardCard.setAttribute('show-claim-button', 'true');
    rewardCard.setAttribute('claim-label', 'Claim reward');
    rewardCard.setAttribute('size', 'medium');

    rewardCard.setConfig(rewardData);

    return rewardCard;
}

export function initRewardCardsDemo(rewards) {
    const rewardsContainer = document.getElementById('rewardsContainer');

    if (!rewardsContainer) return;

    rewards.forEach(rewardData => {
        const rewardCard = createRewardCardElement(rewardData);

        rewardCard.addEventListener('gwc-reward-claim', event => {
            rewardData.state = 'claimed';
            rewardData.claimedAt = new Date();

            rewardCard.setConfig(rewardData);
        });

        rewardsContainer.appendChild(rewardCard);
    });
}