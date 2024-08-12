// 플레이어 클래스
class Player {
    constructor(hp, top, left) {
        this.hp = hp;
        this.top = top;
        this.left = left;
        this.attackPower = 20;
        this.angle = 0;
    }

    updatePosition() {
        const playerElement = document.getElementById("player");
        playerElement.style.top = this.top + "px";
        playerElement.style.left = this.left + "px";
        playerElement.style.transform = `rotate(${this.angle}deg)`;
    }

    aim(mouseX, mouseY) {
        const deltaX = mouseX - (this.left + 10); // 플레이어의 중심을 기준으로 계산
        const deltaY = mouseY - (this.top + 10);
        this.angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        this.updatePosition();
    }

    shoot(bullet) {
        if (!bullet.active) {
            bullet.fire(this.left, this.top, this.angle);
        }
    }
}

// Zombie 클래스
class Zombie {
    constructor(hp, top, left, speed) {
        this.hp = hp;
        this.top = top;
        this.left = left;
        this.speed = speed;
        this.directionX = -speed;
        this.directionY = -speed;
    }

    move() {
        if (this.left <= 10 || this.left >= 770) {
            this.directionX *= -1;
        }
        if (this.top <= 10 || this.top >= 370) {
            this.directionY *= -1;
        }
        this.left += this.directionX;
        this.top += this.directionY;
        this.updatePosition();
    }

    updatePosition() {
        const zombieElement = document.getElementById("zombie");
        zombieElement.style.top = this.top + "px";
        zombieElement.style.left = this.left + "px";
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
        this.top = 0;
        this.left = 0;
        this.speed = 10;
        this.active = false;
        this.angle = 0;
    }

    fire(playerLeft, playerTop, angle) {
        this.left = playerLeft + 10;
        this.top = playerTop + 10;
        this.angle = angle;
        this.active = true;
        document.getElementById("bullet").style.display = "block";
        this.updatePosition();
    }

    move(zombie) {
        if (this.active) {
            this.left += this.speed * Math.cos(this.angle * Math.PI / 180);
            this.top += this.speed * Math.sin(this.angle * Math.PI / 180);
            this.updatePosition();

            if (this.left >= zombie.left && this.left <= zombie.left + 20 &&
                this.top >= zombie.top && this.top <= zombie.top + 20) {
                this.active = false;
                document.getElementById("bullet").style.display = "none";
                return zombie.takeDamage(20);
            }

            if (this.left >= 800 || this.left <= 0 || this.top >= 400 || this.top <= 0) {
                this.active = false;
                document.getElementById("bullet").style.display = "none";
            }
        }
        return false;
    }

    updatePosition() {
        const bulletElement = document.getElementById("bullet");
        bulletElement.style.left = this.left + "px";
        bulletElement.style.top = this.top + "px";
    }
}

// Fighting NPC 클래스
class FightingNPC {
    constructor(hp, top, left) {
        this.hp = hp;
        this.top = top;
        this.left = left;
        this.attackPower = 20;
        this.isZombie = false;
        this.angle = 0;
        this.bullet = new Bullet();
        this.updatePosition();
    }

    updatePosition() {
        const npcElement = document.querySelector('.fighting-npc');
        npcElement.style.top = this.top + "px";
        npcElement.style.left = this.left + "px";
        npcElement.style.transform = `rotate(${this.angle}deg)`;
    }

    aimAt(zombie) {
        const deltaX = zombie.left - this.left;
        const deltaY = zombie.top - this.top;
        this.angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        this.updatePosition();
    }

    shoot(zombie) {
        if (!this.isZombie && !this.bullet.active) {
            this.aimAt(zombie);
            this.bullet.fire(this.left, this.top, this.angle);
        }
        this.bullet.move(zombie);
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0 && !this.isZombie) {
            this.turnIntoZombie();
        }
    }

    turnIntoZombie() {
        this.isZombie = true;
        const npcElement = document.querySelector('.fighting-npc');
        npcElement.classList.add('zombie');
    }
}

// 게임 루프 함수
function gameLoop(player, zombie, bullet, npc, fightingNpc) {
    zombie.move();
    if (bullet.move(zombie)) {
        return true;
    }
    npc.move();
    fightingNpc.shoot(zombie);
    requestAnimationFrame(() => gameLoop(player, zombie, bullet, npc, fightingNpc));
}
