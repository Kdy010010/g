// Player 클래스
class Player {
    constructor(hp, position) {
        this.hp = hp;
        this.position = position;
        this.attackPower = 20;
    }

    moveLeft() {
        if (this.position > 10) {
            this.position -= 10;
            this.updatePosition();
        }
    }

    moveRight() {
        if (this.position < 740) {
            this.position += 10;
            this.updatePosition();
        }
    }

    updatePosition() {
        document.getElementById("player").style.left = this.position + "px";
    }

    shoot(bullet) {
        if (!bullet.active) {
            bullet.fire(this.position);
        }
    }
}

// Zombie 클래스
class Zombie {
    constructor(hp, position, speed) {
        this.hp = hp;
        this.position = position;
        this.speed = speed;
        this.direction = -speed;
    }

    move() {
        if (this.position <= 10 || this.position >= 740) {
            this.direction *= -1;
        }
        this.position += this.direction;
        this.updatePosition();
    }

    updatePosition() {
        document.getElementById("zombie").style.right = (800 - this.position - 50) + "px";
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            alert("You defeated the zombie!");
            return true;
        }
        return false;
    }
}

// Bullet 클래스
class Bullet {
    constructor() {
        this.position = 60;
        this.speed = 7;
        this.active = false;
    }

    fire(playerPosition) {
        this.position = playerPosition + 50;
        this.active = true;
        document.getElementById("bullet").style.display = "block";
        this.updatePosition();
    }

    move(zombie, playerAttackPower) {
        if (this.active) {
            this.position += this.speed;
            this.updatePosition();

            if (this.position >= zombie.position - 50 && this.position <= zombie.position) {
                this.active = false;
                document.getElementById("bullet").style.display = "none";
                this.position = 60;
                return zombie.takeDamage(playerAttackPower);
            }

            if (this.position >= 800) {
                this.active = false;
                document.getElementById("bullet").style.display = "none";
                this.position = 60;
            }
        }
        return false;
    }

    updatePosition() {
        document.getElementById("bullet").style.left = this.position + "px";
    }
}

// NPC 클래스
class NPC {
    constructor(hp, position) {
        this.hp = hp;
        this.position = position;
        this.isZombie = false;
        this.updatePosition();
    }

    move() {
        if (this.isZombie) {
            this.position += 1; // 좀비로 변하면 천천히 이동
            this.updatePosition();
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0 && !this.isZombie) {
            this.turnIntoZombie();
        }
    }

    turnIntoZombie() {
        this.isZombie = true;
        const npcElement = document.querySelector('.npc');
        npcElement.classList.add('zombie');
    }

    updatePosition() {
        document.querySelector('.npc').style.left = this.position + "px";
    }
}

// Fighting NPC 클래스
class FightingNPC {
    constructor(hp, position) {
        this.hp = hp;
        this.position = position;
        this.attackPower = 20;
        this.isZombie = false;
        this.bullet = new Bullet();
        this.updatePosition();
    }

    moveLeft() {
        if (this.position > 10) {
            this.position -= 10;
            this.updatePosition();
        }
    }

    moveRight() {
        if (this.position < 740) {
            this.position += 10;
            this.updatePosition();
        }
    }

    updatePosition() {
        document.querySelector('.fighting-npc').style.left = this.position + "px";
    }

    shoot(zombie) {
        if (!this.isZombie && !this.bullet.active) {
            this.bullet.fire(this.position);
        }
        this.bullet.move(zombie, this.attackPower);
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0 && !this.isZombie) {
            this.turnIntoZombie();
        }
    }

    turnIntoZombie() {
        this.isZombie = true;
        const fightingNpcElement = document.querySelector('.fighting-npc');
        fightingNpcElement.classList.add('zombie');
    }
}

// 게임 루프 함수
function gameLoop(player, zombie, bullet, npc, fightingNpc) {
    zombie.move();
    if (bullet.move(zombie, player.attackPower)) {
        return true;
    }
    npc.move();
    fightingNpc.shoot(zombie);
    requestAnimationFrame(() => gameLoop(player, zombie, bullet, npc, fightingNpc));
}
