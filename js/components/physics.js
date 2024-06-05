/**
 * 简单的物理引擎
 */
export class PhysicsComponent {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.collisionComponent = new CollisionComponent();

        this.staticEntities = [];
        this.platformEntities = [];
        this.objectEntities = [];
        this.g = 0.3; // 重力加速度

    }

    addEntity(entity) {
        if (entity.physicsType === 'static') {
            this.staticEntities.push(entity);
        }
        if (entity.physicsType === 'object') {
            this.objectEntities.push(entity);
        }
        if (entity.physicsType === 'platform') {
            this.platformEntities.push(entity);
        }
    }

    update() {
        for (const objectEntity of this.objectEntities) {
            this.checkCollision(objectEntity);
            [objectEntity.velocityY, objectEntity.position.y] = this.calcY(objectEntity.velocityY, objectEntity.position.y);
            objectEntity.position.y += objectEntity.velocityY;
            if (objectEntity.position.y > this.canvasHeight - objectEntity.height) {
                objectEntity.position.y = this.canvasHeight - objectEntity.height;
                objectEntity.velocityY = 0;
            }
        }
    }



    calcY(velocityY, height) {
        // 计算自上次更新以来经过的时间
        // 更新速度和位置
        velocityY += this.g; // v = u + at
        height += velocityY
        return [velocityY, height];
    }

    checkCollision(objectEntity) {
        for (const platform of this.platformEntities) {
            const rectangles = platform.rectangles;
            for (const rectangle of rectangles) {
                if (this.collisionComponent.detectCollision(objectEntity.position, rectangle)) {
                    if (objectEntity.velocityY > 0) {
                        objectEntity.velocityY = 0;
                        objectEntity.position.y = rectangle.y - objectEntity.height;
                    }
                    continue;
                }
            }
        }

    }

}

class CollisionComponent {
    constructor() {
    }

    //碰撞检测
    detectCollision(entityA, entityB) {

        if (entityA.x + entityA.width > entityB.x &&
            entityA.x < entityB.x + entityB.width &&
            entityA.y + entityA.height > entityB.y &&
            entityA.y < entityB.y + entityB.height) {
            return true;
        } else {
            return false;
        }
    }

    detectTopCollision(entityA, entityB) {
        // Check if entityA is moving downwards and was above entityB in the last frame
        if (entityA.velocityY > 0 && (entityA.y - entityA.velocityY) < (entityB.y + entityB.height)) {
            // Now check if they are colliding
            if (entityA.x < entityB.x + entityB.width &&
                entityA.x + entityA.width > entityB.x &&
                entityA.y + entityA.height > entityB.y &&
                entityA.y < entityB.y + entityB.height) {
                return true;
            }
        }
        return false;
    }
}