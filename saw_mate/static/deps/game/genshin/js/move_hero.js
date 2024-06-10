import { HEROCARDS } from './genshin_hero_card.js';
import { HeroCardsHp, HeroCardsAttack, HeroCardsDefense } from './genshin_scripts.js';

export function moveHero(myActiveCardId, opponentActiveCardId) {
    console.log('карта игрока:', myActiveCardId);
    console.log('карта противника:', opponentActiveCardId);
    //проверка наличия активной карты героя
    if (myActiveCardId !== null && opponentActiveCardId !== null) {
        const myActiveCard = HEROCARDS[myActiveCardId];
        const opponentActiveCard = HEROCARDS[opponentActiveCardId];
        const myActiveHpCard = HeroCardsHp[myActiveCardId];
        const opponentActiveHpCard = HeroCardsHp[opponentActiveCardId];
        const myActiveAttackCard = HeroCardsAttack[myActiveCardId];
        const opponentActiveAttackCard = HeroCardsAttack[opponentActiveCardId];
        const myActiveDefenseCard = HeroCardsDefense[myActiveCardId];
        const opponentActiveDefenseCard = HeroCardsDefense[opponentActiveCardId];
        //позиционирование карточек
        const myHeroCardCoordinates = [
            { position: { x: 0.25, y: 1.06, z: -3.8 }, rotation: { y: 0, z: 3.5 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 1.06, z: -2.4 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 1, z: -3.3 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } }
        ];

        const opponentHeroCardCoordinates = [
            { position: { x: 0.25, y: 1.02, z: -1.2 }, rotation: { y: 0, z: 3 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 1.02, z: -2.4 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 0.98, z: -1.7 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } }
        ];
        //создаем таймлайн анимации хода игрока
        const t1 = gsap.timeline({ defaults: { duration: 0.4, delay: 0.1 } });

        myHeroCardCoordinates.forEach((coords, index) => {
            t1.to(myActiveCard.position, coords.position, index * 0.4)
                .to([myActiveCard.rotation, myActiveHpCard.rotation], coords.rotation, index * 0.4)
                .to([myActiveCard.scale, myActiveHpCard.scale], coords.scale, index * 0.4)
                // Анимация шкалы жизни карточек
                .to(myActiveHpCard.position, {
                    x: coords.position.x + 0.05,
                    y: coords.position.y + 0.05,
                    z: coords.position.z + 0.2
                }, index * 0.4)
                // Анимация шкалы Attack карточек
                .to(myActiveAttackCard.position, {
                    x: coords.position.x + 0.15,
                    y: coords.position.y + 0.05,
                    z: coords.position.z - 0.2
                }, index * 0.4)
                // Анимация шкалы Defense карточек
                .to(myActiveDefenseCard.position, {
                    x: coords.position.x + 0.15,
                    y: coords.position.y + 0.05,
                    z: coords.position.z - 0.3
                }, index * 0.4);
        });
        //карта героя оппонента
        //создаем таймлайн анимации хода противника
        const t2 = gsap.timeline({ defaults: { duration: 0.4, delay: 0.1 } });

        opponentHeroCardCoordinates.forEach((coords, index) => {
            t2.to(opponentActiveCard.position, coords.position, index * 0.4)
                .to([opponentActiveCard.rotation, opponentActiveHpCard.rotation], coords.rotation, index * 0.4)
                .to([opponentActiveCard.scale, opponentActiveHpCard.scale], coords.scale, index * 0.4)
                .to(opponentActiveHpCard.position, {
                    x: coords.position.x + 0.05,
                    y: coords.position.y + 0.05,
                    z: coords.position.z + 0.2
                }, index * 0.4)
                // Анимация шкалы Attack карточек
                .to(opponentActiveAttackCard.position, {
                    x: coords.position.x + 0.15,
                    y: coords.position.y + 0.05,
                    z: coords.position.z - 0.2
                }, index * 0.4)
                // Анимация шкалы Defense карточек
                .to(opponentActiveDefenseCard.position, {
                    x: coords.position.x + 0.15,
                    y: coords.position.y + 0.05,
                    z: coords.position.z - 0.3
                }, index * 0.4);
        });
        
        } else {
            console.log('ошибка - не была выбрана активная карта перед началом раунда')
        }
}