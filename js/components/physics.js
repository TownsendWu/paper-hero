export class PhysicsComponent {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.collisionComponent = new CollisionComponent();
        this.entities = { static: [], platform: [], object: [] };
        this.g = 0.3;
    }

    addEntity(entity) {
        this.entities[entity.physicsType].push(entity);
    }

    update() {
        for (const objectEntity of this.entities.object) {
            [objectEntity.velocityY, objectEntity.position.y] = this.calcY(objectEntity.velocityY, objectEntity.position.y);

            const collision = this.checkCollision(objectEntity);
            if (collision) {
                objectEntity.position.y = collision.y - objectEntity.height;
                objectEntity.velocityY = 0;
                continue;
            }

            objectEntity.position.y += objectEntity.velocityY;

            if (objectEntity.position.y > this.canvasHeight - objectEntity.height) {
                objectEntity.position.y = this.canvasHeight - objectEntity.height;
                objectEntity.velocityY = 0;
            }
        }
    }

    calcY(velocityY, height) {
        velocityY += this.g;
        height += velocityY;
        return [velocityY, height];
    }

    checkCollision(objectEntity) {
        for (const platform of this.entities.platform) {
            const rectangles = platform.rectangles;
            for (const rectangle of rectangles) {
                if (this.collisionComponent.detectCollision(objectEntity.position, rectangle)) {
                    if (this.collisionComponent.detectTopCollision(objectEntity.position, rectangle)) {
                        return rectangle;
                    }

                }
            }
        }
        return null;
    }
}

class CollisionComponent {
    detectCollision(rectA, rectB) {
        return rectA.x + rectA.width > rectB.x && rectA.x < rectB.x + rectB.width && rectA.y + rectA.height > rectB.y && rectA.y < rectB.y + rectB.height;
    }

    detectTopCollision(rectA, rectB) {
        console.log(rectA.y,rectA.height,rectB.y)
        return rectA.y + rectA.height >= rectB.y && rectA.x < rectB.x + rectB.width 
    }
}