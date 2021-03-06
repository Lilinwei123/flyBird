console.log(`main.js`);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var v = 0; // 草坪滚动的增量
var shake = false; // 记录标题的抖动状态
var startTimer; // 开始界面定时器
var startTimeCount = 0; // 开始界面定时器运行的次数
var gameTimer; // 游戏界面定时器
var gameTimeCount = 0; // 游戏界面定时器运行的次数
var pipes = []; // 用来存放生成的水管
var index = 0; //水管的下标

// 初始化
function init() {
    imgs.loadImg(startLayor);
}

// 绘制背景
function drawBg() {
    ctx.drawImage(imgs.bg, 0, 0);
}

// 绘制开始按钮
function drawStartBtn() {
    ctx.drawImage(imgs.startBtn, 130, 300);
}

// 清空画布
function clean() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 绘制草坪，就是那个条条绿
function drawGrass() {
    //每次运行横坐标向左移
    // 画布顶部距离下面滚动的草坪的距离是423
    ctx.drawImage(imgs.grass, 3 * v--, 423);
    ctx.drawImage(imgs.grass, 337 + 3 * v--, 423);
    if (3 * v < -343) {
        v = 0;
    }
}

// 绘制标题，并且有抖动状态
function titleShake() {
    if (shake) {
        ctx.drawImage(imgs.title, 53, 97);
        ctx.drawImage(imgs.bird0, 250, 137);
    } else {
        ctx.drawImage(imgs.title, 53, 103);
        ctx.drawImage(imgs.bird1, 250, 143);
    }
}

function createPipes() {
    var pipe = new Pipe(imgs.up_pipe, imgs.down_pipe, imgs.up_mod, imgs.down_mod);

    // 存放2个水管，如果已经有三个水管，则一次替换
    if (pipes.length < 3) {
        pipes.push(pipe);
    } else {
        pipes[index] = pipe;
        index++;
        if (index >= 3) index = 0;
    }
}

// 绘制开始界面
function startLayor() {
    startTimer = setInterval(function () {
        clean();
        drawBg();
        drawStartBtn();
        drawGrass();
        titleShake();

        //定时器每运行7次改变标题位置
        if (startTimeCount == 7) {
            shake = !shake;
            startTimeCount = 0;
        }
        //运行次数+1
        startTimeCount++;
    }, 24);
}

function gameLayer() {
    gameTimer = setInterval(function () {
        clean();
        drawBg();
        drawGrass();

        // 每30次生成一个新的水管
        if (gameTimeCount % 30 === 0) {
            createPipes();
            gameTimeCount = 0;
        }

        // 每次水管都移动
        for (let j = 0; j < pipes.length; j++) {
            pipes[j].move();
        }

        // 记录小鸟两种状态的下边
        if (gameTimeCount % 5 === 0) 
            bird.wingWave();
        // 绘制小鸟 
        bird.fly();
        isHit();
        gameTimeCount++;

        // alive为false
        if (!bird.alive) {
            gameOver();
            reset();
        }
    }, 36);
}

// 游戏结束，重绘页面，清除计时器、响应事件
function gameOver() {
    //清除定时器
    clearInterval(gameTimer);
    //清除窗口响应事件
    // window.removeEventListener('keydown',kd,false);
    window.removeEventListener('touchstart',ts,false);

    // //绘制GAME OVER
    var gradient=ctx.createLinearGradient(0 ,0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // 用渐变填色
    ctx.fillStyle=gradient;
    ctx.font = "50px blod";
    ctx.fontWeight = '1000';
    ctx.fillText("GAME OVER", 20, 200);
    drawStartBtn();
}

// 重置数据
function reset() {
    // bird.posY = 200;
    // bird.speed = 0;
    // bird.alive = true;
    // pipes = [];
    canvas.addEventListener('click', startBtn_click, false);
}

function startBtn_click(e) {
    //判断点击位置
    if (e.clientX > canvas.offsetLeft + canvas.width / 2 - imgs.startBtn.width / 2 &&
        e.clientX < canvas.offsetLeft + canvas.width / 2 + imgs.startBtn.width / 2 &&
        e.clientY < canvas.offsetTop + 300 + imgs.startBtn.height &&
        e.clientY > canvas.offsetTop + 300) {
        clean();
        //清除开始界面定时器
        clearInterval(startTimer);
        gameLayer();
        //添加响应事件
        // window.addEventListener('keydown', kd, false)
        // 触屏事件
        window.addEventListener('touchstart', ts, false);
        //删除start按钮响应事件
        canvas.removeEventListener('click', startBtn_click, false);
    }
}

// 点击屏幕是小鸟向上飞，速度－10
function ts () {
    bird.speed = -10;
}

// 判断小鸟是否撞击
function isHit() {
    for (let i = 0; i < pipes.length; i++) {
        // 判断小鸟的横向位置和纵向值进行判断
        if (bird.posX + 38 > pipes[i].posX && bird.posX < pipes[i].posX + pipes[i].down_pipe.width) {
            if (bird.posY < pipes[i].up_posY + pipes[i].up_pipe.height || bird.posY + 28 > pipes[i].down_posY) {
                bird.dead();
            }
        }
    }
}

canvas.addEventListener('click', startBtn_click, false);

init();