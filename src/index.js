import './index.css'

class DragBlock {
    constructor (id, config) {
        this.ctn = document.querySelector('#'+id);
        const conf = {
            col: 4,
            height: 60,
            margin: [10, 10],
            mode: 'y'
        }
        this.config = Object.assign(conf, config)

        let w = this.ctn.offsetWidth - this.config.margin[0] * (this.config.col + 1)
        this.config.width = Math.floor(w / this.config.col)
        this.occupiedList = {}
        this.dragStart = {
            row: 0,
            col: 0,
        }
        this.blockId = 1
        this.init()
        this.bindEvent()
    }

    init() {
        this.ctn.classList.add('drag-ctn')
        const blockList = Array.from(this.ctn.children)
        let index = 0
        for (let block of blockList) {
            let row = block.dataset.row ? block.dataset.row : Math.floor(index/this.config.col) + 1,
                col = block.dataset.col ? block.dataset.col : index % this.config.col + 1,
                sizex = block.dataset.sizex ? block.dataset.sizex : 1,
                sizey = block.dataset.sizey ? block.dataset.sizey : 1
            
            while (this.isOccupied(row, col, sizex, sizey)) {
                col ++
                if (col - this.config.col > 0) {
                    row ++
                    col -= this.config.col
                }
            }
            block.dataset.row = row
            block.dataset.col = col
            block.dataset.sizex = sizex
            block.dataset.sizey = sizey
            block.id = 'block' + this.blockId++
            for (let x = 0; x < block.dataset.sizex; x++) {
                for (let y = 0; y < block.dataset.sizey; y++) {
                    let key = (row * 1 + y) + ',' + (col * 1 + x),
                        id = 'tail_' + block.id
                    if (x + y === 0) {
                        id = block.id
                    }
                    this.occupiedList[key] = id
                }
            }

            block.classList.add('drag-block')
            block.style.width = this.config.width * block.dataset.sizex + this.config.margin[0] * (block.dataset.sizex - 1) + 'px';
            block.style.height = this.config.height * block.dataset.sizey + this.config.margin[1] * (block.dataset.sizey - 1) + 'px';
            block.style.left = (block.dataset.col - 1) * ( this.config.width + this.config.margin[0] ) + this.config.margin[0] + 'px';
            block.style.top = (block.dataset.row - 1) * ( this.config.height + this.config.margin[1] ) + this.config.margin[1] + 'px';
            index ++;
        }
    }

    isOccupied(row, col, sizex = 1, sizey = 1) {
        for (let x = 0; x < sizex; x++) {
            for (let y = 0; y < sizey; y++) {
                let r = row * 1 + x,
                    c = col * 1 + y
                if ( (r + ',' + c) in this.occupiedList) {
                    return true
                }
            }
        }
        return false
    }

    bindEvent() {
        this.ctn.addEventListener('mousedown', (event) => {
            let block = event.target,
                op = {
                    x: event.x,
                    y: event.y
                },
                pos = {
                    x: parseFloat(block.style.left),
                    y: parseFloat(block.style.top)
                }
            if (block.classList.contains('drag-block')) {
                block.classList.add('dragging')
                this.removeOccupied(block)
                this.dragStart = block.dataset
                this.ctn.onmousemove = (e) => {
                    let left = pos.x + e.x - op.x,
                        top = pos.y + e.y - op.y,
                        maxX = this.ctn.offsetWidth - this.config.width,
                        maxY = this.ctn.offsetHeight - this.config.height
                    left = left < 0 ? 0 : left
                    top = top < 0 ? 0 : top
                    left = left > maxX ? maxX : left
                    top = top > maxY ? maxY : top
                    block.style.left = left + 'px';
                    block.style.top = top + 'px';
                }
            }

        }, false)

        this.ctn.addEventListener('mouseup', () => {
            this.ctn.onmousemove = null;
            let block = event.target;
            if (!block.classList.contains('drag-block')) {
                return false
            }
            let pos = this.calcPos(block);
            this.getNext(block, pos)
            this.moveNext(block.id)
           
            block.classList.remove('dragging');
            
        }, false)
    }

    calcPos(block) {
        let x = parseFloat(block.style.left),
            y = parseFloat(block.style.top)
        
        let pos = { 
            col: Math.round( x / ( this.config.width + this.config.margin[0] ) ) + 1,
            row: Math.round( y / ( this.config.height + this.config.margin[1] ) ) + 1
        }
        return pos
    }

    getNext(block, nextPos) {
        let pos = {},
            originC = block.dataset.col,
            originR = block.dataset.row
        let {col, row} = nextPos
        let {sizex, sizey} = block.dataset
        
        for (let c = 0; c < sizex; c ++) {
            for (let r = 0; r < sizey; r ++) {
                let id = 'tail_' + block.id
                if (r + c === 0) {
                    id = block.id
                }

                let from = (originR * 1 + r) + ',' + (originC * 1 + c),
                    to = (row * 1 + r) + ',' + (col * 1 + c)
                delete this.occupiedList[from]
                pos[to] = id
                
            }
        }
        this.blockSort(pos)
    }


    moveTo (id, pos) {
        let block = document.getElementById(id)
        let left = (pos.col - 1) * ( this.config.width + this.config.margin[0] ) + this.config.margin[0],
            top = (pos.row - 1) * ( this.config.height + this.config.margin[1] ) + this.config.margin[1],
            step = {}
        step.x = (left - parseFloat(block.style.left)) / 30
        step.y = (top - parseFloat(block.style.top)) / 30
        block.dataset.row = pos.row
        block.dataset.col = pos.col
        let data = {
            block: block,
            step: step,
            frame: 30
        }
        window.requestAnimationFrame(this.moveAnimation(data));
    }
    
    moveNext(blockId) {
        for (let x in this.occupiedList) {
            let id = this.occupiedList[x]
            if (id === blockId) {
                let [r,c] = x.split(',')
                this.moveTo(id, {
                    row: r,
                    col: c
                })
            } else if (id && id.substr(0, 5) !== 'tail_') {
                let {row,col} = document.getElementById(id).dataset
                if ( row + ',' + col !== x ) {
                    let [r,c] = x.split(',')
                    this.moveTo(id, {
                        row: r,
                        col: c
                    })
                }
            }
        }
    }

    moveAnimation (data) {
        let self = this
        let {block, step, frame} = data
        return function next() {
            if (frame > 0) {
                block.style.left = parseFloat(block.style.left) + step.x + 'px';
                block.style.top = parseFloat(block.style.top) + step.y + 'px';
                frame--;
                window.requestAnimationFrame(next);
            }
        }
        
    }

    removeOccupied (block) {
        let pos = block.dataset.row + ',' + block.dataset.col
        delete this.occupiedList[pos]
    }

    blockSort(pos) {
        let moveList = []
        if (this.config.mode !== 'left') {
            for (let i = 0; i < this.config.col; i++) {
                moveList[i] = []
            }
        }
        for (let key in this.occupiedList) { 
            let [row, col] = key.split(',')
            if (this.config.mode === 'x') {
                if (!moveList[row - 1]) {
                    moveList[row - 1] = []
                }
                moveList[row - 1][col - 1] = this.occupiedList[key]
            } else if (this.config.mode === 'y') {
                if (!moveList[col - 1]) {
                    moveList[col - 1] = []
                }
                moveList[col - 1][row - 1] = this.occupiedList[key]
            } else if (this.config.mode === 'left') {
                let index = (row - 1) * this.config.col + (col - 1)
                moveList[index] = this.occupiedList[key]
            }
        }
        let arr = this.removeEmpty(moveList)
        
        this.occupiedList = {}
        if (this.config.mode === 'x') {
            for (let x in pos) {
                let [m,n] = x.split(',')
                if (!arr[m-1]) {
                    arr[m-1] = []
                }
                arr[m-1].splice(n-1, 0, pos[x])
            }
            for (let r = 0; r < arr.length; r ++) {
                for (let c = 0; c < arr[r].length; c ++) {
                    let key = (r + 1) + ',' + (c + 1)
                    this.occupiedList[key] = arr[r][c]
                }
            }
        } else if (this.config.mode === 'y') {
            for (let x in pos) {
                let [m,n] = x.split(',')
                if (!arr[n-1]) {
                    arr[n-1] = []
                }
                let index = m - 1
                
                while( (arr[n-1][index] && arr[n-1][index].substr(0, 5) === 'tail_') || pos[x].indexOf(arr[n-1][index]) >= 0 ) {
                    index ++
                }
                arr[n-1].splice(index, 0, pos[x])
            }
            for (let c = 0; c < arr.length; c ++) {
                for (let r = 0; r < arr[c].length; r ++) {
                    let key = (r + 1) + ',' + (c + 1)
                    this.occupiedList[key] = arr[c][r]
                }
            }
        } else if (this.config.mode === 'left') {
            for (let x in pos) {
                let [m,n] = x.split(','),
                    i = (m - 1) * this.config.col + (n - 1)
                arr.splice(i, 0, pos[x])
            }
            
            let index = 0
            for (let item of arr) {
                let key = (Math.floor(index/this.config.col) + 1) + ',' + (index%this.config.col + 1)
                this.occupiedList[key] = item
                index++
            }  
        }
        
    }

    moveOut(id, pos) {
        let moveList = this.blockSort(id, pos)
        if (this.config.mode === 'x') {
            let index = 1
            for (let item of moveList) {
                if (item) {
                    this.moveTo(item, {row: pos.row, col: index++})
                }
            } 
        } else if (this.config.mode === 'y') {
            let index = 1
            for (let item of moveList) {
                if (item) {
                    this.moveTo(item, {row: index++, col: pos.col})
                }
            } 
        }
    }

    removeEmpty(arr) {
        let res = []
        for (let item of arr) {
            
            if (item instanceof Array) {
                res.push(this.removeEmpty(item))
            } else {
                if (item !== undefined) {
                    res.push(item)
                }
            }
        }
        return res
    }

    addBlock(html) {
        this.ctn.insertAdjacentHTML('beforeend', html)
        let dom = this.ctn.lastElementChild
        dom.id = 'block' + this.blockId++
        dom.classList.add('drag-block')
        dom.style.width = this.config.width + 'px';
        dom.style.height = this.config.height + 'px';
        dom.dataset.col = 0
        dom.dataset.row = 0
        dom.dataset.sizex = 1
        dom.dataset.sizey = 1
        dom.style.left = this.config.margin[0] + 'px'
        dom.style.top = this.config.margin[1] + 'px'
        let pos = this.calcPos(dom)
        this.getNext(block, pos)
        this.moveNext(dom.id)
    }

    removeBlock(id) {
        let b = document.getElementById(id)
        if (b) {
            this.removeOccupied(b)
            this.ctn.removeChild(b)
            this.blockSort({})
            this.moveNext('')
        }
    }
}

export default DragBlock