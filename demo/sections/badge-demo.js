function createBadgeElement(badgeData) {
    const badge = document.createElement('gwc-badge');

    badge.setAttribute('show-name', 'true');
    badge.setAttribute('show-description', 'true');
    badge.setAttribute('show-rarity', 'true');
    badge.setAttribute('show-progress', 'true');
    badge.setAttribute('show-state-label', 'true');
    badge.setAttribute('size', 'medium');
    badge.setAttribute('claim-label', 'Claim reward');

    badge.setConfig(badgeData);

    return badge;
}

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

export function initBadgeDemo(badges, streakMasterReward) {
    const claimableBadgeDemo = document.getElementById('claimableBadgeDemo');
    const claimableRewardDemo = document.getElementById('claimableRewardDemo');
    const streakMasterBadge = badges.find(badge => badge.id === 3);

    if (claimableBadgeDemo && claimableRewardDemo && streakMasterBadge) {
        const badge = createBadgeElement(streakMasterBadge);
        const rewardCard = createRewardCardElement(streakMasterReward);

        const markClaimed = () => {
            streakMasterBadge.state = 'claimed';
            streakMasterBadge.claimedAt = new Date();
            streakMasterBadge.description = 'Reward already claimed: 100 coins.';

            streakMasterReward.state = 'claimed';
            streakMasterReward.claimedAt = new Date();
            streakMasterReward.description = 'Reward already claimed for Streak Master.';

            badge.setConfig(streakMasterBadge);
            rewardCard.setConfig(streakMasterReward);
        };

        badge.addEventListener('gwc-badge-claim', event => {
            markClaimed();
        });

        rewardCard.addEventListener('gwc-reward-claim', event => {
            markClaimed();
        });

        claimableBadgeDemo.appendChild(badge);
        claimableRewardDemo.appendChild(rewardCard);
    }

    const badgesContainer = document.getElementById('badgesContainer');

    badges
        .filter(badgeData => badgeData.id !== 3)
        .forEach(badgeData => {
            const badge = createBadgeElement(badgeData);

            badge.addEventListener('gwc-badge-claim', event => {
                badgeData.state = 'claimed';
                badgeData.claimedAt = new Date();
                badgeData.description = 'Reward already claimed.';

                badge.setConfig(badgeData);
            });

            badgesContainer.appendChild(badge);
        });
}