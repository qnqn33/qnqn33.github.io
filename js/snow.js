/* 全屏下雪特效 - 真实雪花结晶版 (六角星形) */
(function () {
    // ================= 配置区域 =================
    // 1. 雪花颜色池 (纯白、极淡蓝、清爽蓝、深蓝)
    var colors = ['#ffffff', '#f0fbff', '#bfefff', '#4a84eb'];

    // 2. 雪花数量 (建议 40-60，太多会卡)
    var flakeCount = 50;
    // ===========================================

    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = window.innerHeight;
    var flakes = [];

    canvas.width = width;
    canvas.height = height;

    window.addEventListener('resize', function () {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    function randomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // --- 核心改动：绘制六角雪花结晶 (星形) ---
    function drawSnowflakeStar(ctx, x, y, outerRadius, color) {
        // 内圈半径是外圈的一半，形成尖角
        const innerRadius = outerRadius * 0.5;
        const spikes = 6; // 6个角
        const step = Math.PI / spikes; // 每一步走30度

        ctx.beginPath();
        ctx.fillStyle = color;
        // 设置一点透明度，更有冰晶感
        ctx.globalAlpha = 0.8;

        // 初始角度设为负90度，让一个尖角垂直向上
        let rot = -Math.PI / 2;
        let vx, vy;

        for (let i = 0; i < spikes; i++) {
            // 1. 画向外的尖点
            vx = x + Math.cos(rot) * outerRadius;
            vy = y + Math.sin(rot) * outerRadius;
            if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
            rot += step;

            // 2. 画向内的凹点
            vx = x + Math.cos(rot) * innerRadius;
            vy = y + Math.sin(rot) * innerRadius;
            ctx.lineTo(vx, vy);
            rot += step;
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0; // 还原全局透明度
    }
    // ---------------------------------------

    // 雪花对象
    function Flake() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vy = Math.random() * 1.2 + 0.5; // 下落速度略微调慢，更优雅
        this.vx = Math.random() * 0.8 - 0.4; // 左右飘动幅度
        // 尺寸稍微调大一点 (3px - 8px)，否则看不清形状
        this.r = Math.random() * 5 + 3;
        this.color = randomColor();
        // 增加一个随机旋转角度，让每个雪花方向不一样
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02; // 缓慢自转
    }

    for (var i = 0; i < flakeCount; i++) {
        flakes.push(new Flake());
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < flakes.length; i++) {
            var f = flakes[i];

            // 保存画布状态，进行旋转
            ctx.save();
            ctx.translate(f.x, f.y); // 把画布中心移动到雪花位置
            ctx.rotate(f.rotation); // 旋转画布

            // 在中心点 (0,0) 绘制雪花
            drawSnowflakeStar(ctx, 0, 0, f.r, f.color);

            ctx.restore(); // 恢复画布状态

            // 更新位置和旋转
            f.y += f.vy;
            f.x += f.vx;
            f.rotation += f.rotationSpeed; // 更新自转角度

            if (f.y > height + 10) {
                f.y = -10;
                f.x = Math.random() * width;
                f.color = randomColor();
            }
            if (f.x > width + 10) f.x = -10;
            if (f.x < -10) f.x = width + 10;
        }
        requestAnimationFrame(draw);
    }

    draw();
})();