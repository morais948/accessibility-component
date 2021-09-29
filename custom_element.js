class CustomAccessibility extends HTMLElement{

    constructor(){
        super()

        this.shadow = this.attachShadow({mode: 'open'})
        this.raiz = document.createElement('div')
        this.initStorage()

        this.defaultColor = this.getAttribute("color-font") || '#056162'
        this.zoom = parseInt(localStorage.getItem('custom-zoom'))
        this.dark = localStorage.getItem('custom-dark') == 'false' ? false : true
        this.map = {
            'less': {
                key: 76,
                press: false
            },
            'plus': {
                key: 80,
                press: false
            },
            'shift': {
                key: 16,
                press: false
            },
            'r': {
                key: 82,
                press: false
            },
            'd': {
                key: 68,
                press: false
            }
        }

        this.start()
    }

    initStorage(){
        !localStorage.getItem('custom-zoom') ? localStorage.setItem('custom-zoom', 100) : document.body.style.zoom = `${localStorage.getItem('custom-zoom')}%`
        localStorage.getItem('custom-dark') &&
            localStorage.getItem('custom-dark') === 'true' ? this.setConfig('all 1s', 'black', 'white') : this.setConfig('none', 'none', 'none')
    }

    createElements(){
        const options = document.createElement('div')
        options.setAttribute('class', 'options')
        options.setAttribute('id', 'opt')
        options.innerHTML = `
            <ul>
                <li id="darkMode"><i class="fas fa-adjust"></i> (Shift + D)</li>
                <li id="zoomIn"><i class="fas fa-search-plus"></i> (Shift + P)</li>
                <li id="zoomOut"><i class="fas fa-search-minus"></i> (Shift + L)</li>
                <li id="resetOptions">Reset (Shift + R)</li>
            </ul>
        `
        this.raiz.appendChild(options)
    }

    verifyKeys(event){

        switch (event.keyCode) {
            case this.map.shift.key:
                this.map.shift.press = true
                break;

            case this.map.less.key:
                this.map.less.press = true
                break;

            case this.map.plus.key:
                this.map.plus.press = true
                break;

            case this.map.r.key:
                this.map.r.press = true
                break;

            case this.map.d.key:
                this.map.d.press = true
                break;
        
            default:
                break;
        }
    
        if(this.map.shift.press && this.map.less.press){
            this.zoomOut()
            this.map.shift.press = false
            this.map.less.press = false
        }
        if(this.map.shift.press && this.map.plus.press){
            this.zoomIn()
            this.map.shift.press = false
            this.map.plus.press = false
        }
        if(this.map.shift.press && this.map.r.press){
            this.resetOptions()
            this.map.shift.press = false
            this.map.r.press = false
        }
        if(this.map.shift.press && this.map.d.press){
            this.darkMode()
            this.map.shift.press = false
            this.map.d.press = false
        }
    }

    zoomOut(){
        this.zoom -= 10
        document.body.style.zoom = `${this.zoom}%`
        localStorage.setItem('custom-zoom', this.zoom)
    }

    zoomIn(){
        this.zoom += 10
        document.body.style.zoom = `${this.zoom}%`
        localStorage.setItem('custom-zoom', this.zoom)
    }

    resetOptions(){
        this.zoom = 100
        document.body.style.zoom = `${this.zoom}%`
        localStorage.setItem('custom-zoom', this.zoom)

        this.dark = false
        localStorage.setItem('custom-dark', this.dark)
        this.setConfig('none', 'white', 'black')
        this.raiz.classList.remove('white')
    }

    darkMode(){
        this.dark = !this.dark

        if(this.dark){
            this.setConfig('all 1s', 'black', 'white')
        }else{
            this.setConfig('none', 'white', 'black')
        }
        localStorage.setItem('custom-dark', this.dark)
    }

    setConfig(transition, backgroundColor, color){
        document.body.style.transition = transition
        document.body.style.backgroundColor = backgroundColor
        document.body.style.color = color
        document.body.style.zoom = `${this.zoom}%`
    }

    showOptOrNo(){
        this.addEventListener('mouseenter', _ => this.shadow.getElementById('opt').style.display = 'block')
        this.addEventListener('mouseleave', _ => this.shadow.getElementById('opt').style.display = 'none')
    }

    start(){
        this.raiz.innerHTML = this.getAttribute('icon') || '<i class="fas fa-universal-access icon"></i>'
        this.raiz.setAttribute('class', 'raiz')
        this.setStyle()
        this.showOptOrNo()
        this.createElements()
        this.shadow.appendChild(this.raiz)

        this.shadow.getElementById('darkMode').addEventListener('click', this.darkMode.bind(this))
        this.shadow.getElementById('zoomOut').addEventListener('click', this.zoomOut.bind(this))
        this.shadow.getElementById('zoomIn').addEventListener('click', this.zoomIn.bind(this))
        this.shadow.getElementById('resetOptions').addEventListener('click', this.resetOptions.bind(this))

        document.addEventListener('keydown', this.verifyKeys.bind(this))
    }

    setStyle(){
        const dependency = document.createElement('link')
        dependency.setAttribute('rel', 'stylesheet')
        dependency.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css')
        dependency.setAttribute('integrity', 'sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==')
        dependency.setAttribute('crossorigin', 'anonymous')
        dependency.setAttribute('referrerpolicy', 'no-referrer')
    
        const style = document.createElement('style')
        style.textContent = `
            .raiz{
                color: ${this.defaultColor};
                font-size: 4rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: 2%;
                top: calc(50% - 4rem);
            }
            .white{
                color: white;
            }
            .raiz:hover{
                cursor: pointer;
            }
            .options{
                font-size: 1rem;
                display: none;
                border: solid 1px gray;
                border-radius: 10px;
                padding: 10px;
            }
            .options ul{
                padding-left: 0px;
                padding-right: 0px;
            }
            .options li{
                list-style-type: none;
                padding: 5px;
            }
            .options li:hover{
                border: solid 1px gray;
                border-radius: 10px;
            }
        `
        this.shadow.appendChild(dependency)
        this.shadow.appendChild(style)
    }
}

customElements.define('custom-accessibility', CustomAccessibility)