// 游戏状态
const gameState = {
    peer: null,
    conn: null,
    playerId: '',
    opponentId: '',
    playerChoice: null,
    opponentChoice: null,
    playerScore: 0,
    opponentScore: 0
};

// DOM元素
const elements = {
    createGameBtn: document.getElementById('createGame'),
    joinGameBtn: document.getElementById('joinGame'),
    joinGameInput: document.getElementById('joinGameId'),
    gameArea: document.getElementById('gameArea'),
    connectionArea: document.getElementById('connectionArea'),
    waiting: document.getElementById('waiting'),
    playerId: document.getElementById('playerId'),
    opponentId: document.getElementById('opponentId'),
    choices: document.getElementById('choices'),
    result: document.getElementById('result'),
    gameLog: document.getElementById('gameLog')
};

// 初始化
function init() {
    // 创建Peer连接
    gameState.peer = new Peer();
    
    // Peer连接打开时
    gameState.peer.on('open', (id) => {
        gameState.playerId = id;
        elements.playerId.textContent = id;
        addLog('你的游戏ID已生成');
    });
    
    // 接收连接时
    gameState.peer.on('connection', (conn) => {
        conn.on('open', () => {
            setupConnection(conn);
            addLog('对手已连接');
        });
    });
    
    // 错误处理
    gameState.peer.on('error', (err) => {
        console.error(err);
        addLog(`错误: ${err.type}`);
    });
    
    // 按钮事件
    elements.createGameBtn.addEventListener('click', createGame);
    elements.joinGameBtn.addEventListener('click', joinGame);
    
    // 选择手势
    document.querySelectorAll('.choice').forEach(choice => {
        choice.addEventListener('click', () => makeChoice(choice.dataset.choice));
    });
}

// 创建游戏
function createGame() {
    elements.connectionArea.style.display = 'none';
    elements.waiting.style.display = 'block';
    elements.gameArea.style.display = 'block';
    addLog('等待对手连接...');
}

// 加入游戏
function joinGame() {
    const opponentId = elements.joinGameInput.value.trim();
    if (!opponentId) return;
    
    elements.connectionArea.style.display = 'none';
    elements.waiting.style.display = 'block';
    
    // 连接到对方
    const conn = gameState.peer.connect(opponentId);
    
    conn.on('open', () => {
        setupConnection(conn);
        addLog(`已连接到 ${opponentId}`);
    });
    
    conn.on('error', (err) => {
        console.error(err);
        addLog(`连接错误: ${err}`);
    });
}

// 设置连接
function setupConnection(conn) {
    gameState.conn = conn;
    gameState.opponentId = conn.peer;
    elements.opponentId.textContent = conn.peer;
    
    elements.waiting.style.display = 'none';
    elements.gameArea.style.display = 'block';
    
    // 接收数据
    conn.on('data', (data) => {
        if (data.type === 'choice') {
            gameState.opponentChoice = data.choice;
            addLog(`对手选择了 ${data.choice}`);
            checkResult();
        } else if (data.type === 'restart') {
            restartGame();
            addLog('对手请求重新开始');
        }
    });
    
    // 连接关闭
    conn.on('close', () => {
        addLog('对手已断开连接');
        elements.opponentId.textContent = '已断开';
    });
}

// 做出选择
function makeChoice(choice) {
    if (!gameState.conn || !gameState.conn.open) {
        addLog('错误: 未连接到对手');
        return;
    }
    
    if (gameState.playerChoice) {
        addLog('你已经做出了选择');
        return;
    }
    
    gameState.playerChoice = choice;
    addLog(`你选择了 ${choice}`);
    
    // 发送选择给对手
    gameState.conn.send({
        type: 'choice',
        choice: choice
    });
    
    // 检查结果（如果对手已经选择）
    if (gameState.opponentChoice) {
        checkResult();
    }
}

// 检查结果
function checkResult() {
    if (!gameState.playerChoice || !gameState.opponentChoice) return;
    
    const result = getResult(gameState.playerChoice, gameState.opponentChoice);
    
    if (result === 1) {
        gameState.playerScore++;
        elements.result.textContent = `你赢了! ${gameState.playerChoice} 胜过 ${gameState.opponentChoice}`;
        addLog('你赢了这一轮!');
    } else if (result === -1) {
        gameState.opponentScore++;
        elements.result.textContent = `你输了! ${gameState.opponentChoice} 胜过 ${gameState.playerChoice}`;
        addLog('你输了这一轮!');
    } else {
        elements.result.textContent = `平局! 你们都选择了 ${gameState.playerChoice}`;
        addLog('这一轮是平局!');
    }
    
    // 显示分数
    addLog(`当前比分: 你 ${gameState.playerScore} - ${gameState.opponentScore} 对手`);
    
    // 重置选择
    setTimeout(() => {
        gameState.playerChoice = null;
        gameState.opponentChoice = null;
        elements.result.textContent = '请选择你的手势';
    }, 2000);
}

// 获取结果 (1=赢, 0=平, -1=输)
function getResult(player, opponent) {
    if (player === opponent) return 0;
    
    if (
        (player === '✊' && opponent === '✌️') ||
        (player === '✌️' && opponent === '✋') ||
        (player === '✋' && opponent === '✊')
    ) {
        return 1;
    }
    
    return -1;
}

// 重新开始游戏
function restartGame() {
    gameState.playerChoice = null;
    gameState.opponentChoice = null;
    gameState.playerScore = 0;
    gameState.opponentScore = 0;
    elements.result.textContent = '游戏已重置，请选择你的手势';
    addLog('游戏已重置');
}

// 添加日志
function addLog(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    elements.gameLog.appendChild(logEntry);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
}

// 初始化游戏
init();
