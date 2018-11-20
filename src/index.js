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
        this.occupiedList = []
        this.dragStart = {
            row: 0,
            col: 0,
        }
        this.bookList = []
        this.movingCount = 0
        this.blockId = 1
        this.init()
        this.bindEvent()
    }

    divideArea() {
        
    }

    init() {
        this.ctn.classList.add('drag-ctn')
        const blockList = Array.from(this.ctn.children)
        let index = 0
        for (let block of blockList) {
            block.dataset.row = block.dataset.row ? block.dataset.row : Math.floor(index/this.config.col) + 1
            block.dataset.col = block.dataset.col ? block.dataset.col : index % this.config.col + 1
            block.id = 'block' + this.blockId++
            this.occupiedList.push(block.dataset.row+','+block.dataset.col)

            block.classList.add('drag-block')
            block.style.width = this.config.width + 'px';
            block.style.height = this.config.height + 'px';
            block.style.left = (block.dataset.col - 1) * ( this.config.width + this.config.margin[0] ) + this.config.margin[0] + 'px';
            block.style.top = (block.dataset.row - 1) * ( this.config.height + this.config.margin[1] ) + this.config.margin[1] + 'px';
            index ++;
        }
    }

    bindEvent () {
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
            
            if(this.dragStart.row != pos.row || this.dragStart.col != pos.col) {
                this.moveIn(block.id, pos)
                if ( (this.config.mode === 'x' && pos.row != block.dataset.row) || (this.config.mode === 'y' && pos.col != block.dataset.col) ) {
                    this.moveOut(block.id, block.dataset)
                }
            } else {
                this.moveTo(block.id, pos);
            }
           
            block.classList.remove('dragging');
            
        }, false)
    }

    calcPos(block) {
        let x = parseFloat(block.style.left),
            y = parseFloat(block.style.top)
        
        let col = Math.round( x / ( this.config.width + this.config.margin[0] ) ) + 1,
            row = Math.round( y / ( this.config.height + this.config.margin[1] ) ) + 1;

        return {row, col}
    }

    bookPos(id, pos) {
        this.bookList.push([id, pos])
    }

    setPos() {
        for (let item of this.bookList) {
            let dom = document.getElementById(item[0])
            dom.dataset.col = item[1].col
            dom.dataset.row = item[1].row
        }
        this.bookList = []
        this.occupiedList = []
        let blockList = document.querySelectorAll('.drag-block')
        for (let i = 0; i < blockList.length; i++) {
            this.occupiedList.push(blockList[i].dataset.row + ',' + blockList[i].dataset.col);
        }
    }

    moveTo (id, pos) {
        let block = document.getElementById(id)
        let left = (pos.col - 1) * ( this.config.width + this.config.margin[0] ) + this.config.margin[0],
            top = (pos.row - 1) * ( this.config.height + this.config.margin[1] ) + this.config.margin[1],
            step = {}
        step.x = (left - parseFloat(block.style.left)) / 30
        step.y = (top - parseFloat(block.style.top)) / 30
        this.bookPos(block.id, pos)
        let data = {
            block: block,
            step: step,
            frame: 30
        }
       
        window.requestAnimationFrame(this.moveAnimation(data));
    }

    moveAnimation (data) {
        let self = this
        self.movingCount++
        let {block, step, frame} = data
        return function next() {
            if (frame > 0) {
                block.style.left = parseFloat(block.style.left) + step.x + 'px';
                block.style.top = parseFloat(block.style.top) + step.y + 'px';
                frame--;
                window.requestAnimationFrame(next);
            } else {
                self.movingCount--
                if (self.movingCount === 0) {
                    self.setPos()
                }
            }
        }
        
    }

    removeOccupied (block) {
        let pos = block.dataset.row + ',' + block.dataset.col
        for (let i = 0; i < this.occupiedList.length; i++) {
            if (this.occupiedList[i] === pos) {
                this.occupiedList.splice(i, 1);
                break;
            }
        }
    }

    blockSort(id, pos) {
        let moveList = [], domList = null
        if (this.config.mode === 'x') {
            domList = document.querySelectorAll('.drag-block[data-row="' + pos.row + '"]')
            for (let item of [...domList]) { 
                if (item.id === id) {
                    continue;
                } else {
                    moveList[item.dataset.col - 1] = item.id
                }        
            }
        } else if (this.config.mode === 'y') {
            domList = document.querySelectorAll('.drag-block[data-col="' + pos.col + '"]')
            for (let item of [...domList]) { 
                if (item.id === id) {
                    continue;
                } else {
                    moveList[item.dataset.row - 1] = item.id
                }        
            }
        } else if (this.config.mode === 'left') {
            domList = document.querySelectorAll('.drag-block')
            for (let item of [...domList]) { 
                if (item.id === id) {
                    continue;
                } else {
                    let index = (item.dataset.row - 1) * this.config.col + (item.dataset.col - 1)
                    moveList[index] = item.id
                }        
            }
        }
        
        return this.removeEmpty(moveList)
    }

    moveIn (id, pos) {
        let dist = pos.row + ',' + pos.col
        let moveList = this.blockSort(id, pos)
        if (this.config.mode === 'x') {
            moveList.splice(pos.col-1, 0, id)
            let index = 1
            for (let item of moveList) {
                if (item) {
                    this.moveTo(item, {row: pos.row, col: index++})
                }
            }  
            
        } else if (this.config.mode === 'y') {
            moveList.splice(pos.row-1, 0, id)
            let index = 1
            for (let item of moveList) {
                if (item) {
                    this.moveTo(item, {row: index++, col: pos.col})
                }
            }  
        } else if (this.config.mode === 'left') {
            let i = (pos.row - 1) * this.config.col + (pos.col - 1)
            moveList.splice(i, 0, id)
            let index = 0
            for (let item of moveList) {
                if (item) {
                    this.moveTo(item, {row: Math.floor(index/this.config.col) + 1, col: index%this.config.col + 1})
                    index++
                }
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
            if (item !== undefined) {
                res.push(item)
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
        dom.dataset.col = dom.dataset.col ? dom.dataset.col : 1
        dom.dataset.row = dom.dataset.row ? dom.dataset.row : 1
        dom.style.left = this.config.margin[0] + 'px'
        dom.style.top = this.config.margin[1] + 'px'
        this.moveIn(dom.id, dom.dataset)
    }

    removeBlock(id) {
        let b = document.getElementById(id)
        if (b) {
            let pos = b.dataset
            this.ctn.removeChild(b)
            this.moveOut(id, pos)
        }
    }
}

export default DragBlock