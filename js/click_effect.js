/* 鼠标点击爆炸特效 - 冰晶星星版 */
(function () {
    // ================= 配置区域 =================
    // 1. 爆炸产生的粒子数量 (建议 20-50，太多会卡)
    const particleCount = 20;

    // 2. 粒子的颜色池 (深蓝、冰蓝、纯白)
    const colors = ['#4a84eb', '#aaddff', '#ffffff', '#cce6ff'];

    // 3. 粒子的形状池 (雪花、星星、闪光)
    const shapes = ['❄️', '★'];
    // ===========================================

    // 注入基础 CSS 样式
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .click-particle { 
            position: absolute; 
            pointer-events: none; 
            z-index: 99999; 
            font-size: 16px; /* 基础大小 */
            will-change: transform, opacity; /* 性能优化 */
        }
        /* 定义爆炸动画关键帧 */
        @keyframes explodeAnim { 
            0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot)); opacity: 0; } 
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    // 辅助函数：生成指定范围的随机数
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 辅助函数：随机挑选数组中的一个元素
    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 核心：创建单个粒子
    function createParticle(x, y) {
        const particle = document.createElement('span');
        particle.className = 'click-particle';

        // 设置初始位置 (鼠标点击处)
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        // 随机外观
        particle.innerText = randomItem(shapes);
        particle.style.color = randomItem(colors);
        particle.style.fontSize = random(12, 24) + 'px'; // 随机大小

        // 随机物理属性 (向四周飞散的距离和角度)
        const destinationX = (Math.random() - 0.5) * 200; // X轴飞散范围 -100到100px
        const destinationY = (Math.random() - 0.5) * 200; // Y轴飞散范围 -100到100px
        const rotation = random(0, 360); // 随机旋转角度
        const duration = random(800, 1200); // 动画持续时间 0.8-1.2秒

        // 设置 CSS 变量传给动画
        particle.style.setProperty('--tx', `${destinationX}px`);
        particle.style.setProperty('--ty', `${destinationY}px`);
        particle.style.setProperty('--rot', `${rotation}deg`);

        // 应用动画
        particle.style.animation = `explodeAnim ${duration}ms ease-out forwards`;

        document.body.appendChild(particle);

        // 动画结束后清理 DOM
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, duration);
    }

    // 监听点击事件
    document.addEventListener('click', function (e) {
        // 循环创建指定数量的粒子
        for (let i = 0; i < particleCount; i++) {
            // 稍微错开一点点时间，让爆炸更有层次感
            setTimeout(() => {
                createParticle(e.pageX, e.pageY);
            }, i * 10);
        }
    });
})();