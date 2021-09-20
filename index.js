const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'player'
const cd = $('.cd')
const heading = $('header h4')
const heading2 = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    arraySong: [],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    ispullProgress: false,
    songs: [{
            name: "Nevada",
            singer: "Vicetone",
            path: "./music/song1.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Summertime [Sunshine]",
            singer: "K-391",
            path: "./music/song2.mp3",
            image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "lemon Tree",
            singer: "Fools Garden",
            path: "./music/song3.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "TheFatRat",
            singer: "Monody",
            path: "./music/song4.mp3",
            image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Monster",
            singer: "Vocal Katie Sky",
            path: "./music/song5.mp3",
            image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "My love",
            singer: "Westlife",
            path: "./music/song6.mp3",
            image: "https://scontent.fhan3-3.fna.fbcdn.net/v/t1.6435-9/205755279_348424543306735_8633793858234478478_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=e3f864&_nc_ohc=ZtXo1av9378AX8gQvay&_nc_ht=scontent.fhan3-3.fna&oh=8447078252f0dee67b031887e3740016&oe=6166F299"
        },
        {
            name: "Nơi ấy",
            singer: "Hà okio",
            path: "./music/song7.mp3",
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
        {
            name: "Reality",
            singer: "Janieck devy",
            path: "./music/song8.mp3",
            image: "https://www.gossipetv.com/wp-content/uploads/2016/07/Janieck-Devy.jpg"
        },
    ],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
        isRandom: false,
        isRepeat: false,
        currentIndex: 0,
    },
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    setBtnConfig: function() {
        if (this.config.isRandom) {
            randomBtn.classList.toggle('active')
        }
        if (this.config.isRepeat) {
            repeatBtn.classList.toggle('active')
        }
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
        <div class="song" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">'${song.name}'</h3>
                    <p class="author">'${song.singer}'</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        })
        playList.innerHTML = htmls.join('\n')
        this.highlightList()
    },
    highlightList: function() {
        const songList = $$('.song')
        for (let i = 0; i < songList.length; i++) {
            if (songList[i].dataset.index == this.currentIndex) {
                setTimeout(() => {
                    songList[i].classList.add('active')
                    songList[i].scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                    })
                }, 100)
            } else {
                songList[i].classList.remove('active')
            }
        }
    },
    handleEvents: function() {
        const _this = this
            // Xử lí phóng to/thu nhỏ CD
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
                const scrollTop = window.scrollTop || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth
            }
            // Xử lí nút play/pause
        audio.onplay = function() {
            _this.isPlaying = true
            playBtn.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function() {
                _this.isPlaying = false
                playBtn.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            // Xử lí play/pause
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
            }
            // Xử lí thanh Progress
        audio.ontimeupdate = function() {
                if (audio.duration && !_this.ispullProgress) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
            // Xử lí tua bài hát
        progress.onpointerdown = function() {
            _this.ispullProgress = true
        }
        progress.onpointerup = function(e) {
                const seekTime = e.target.value / 100 * audio.duration
                audio.currentTime = seekTime
                _this.ispullProgress = false
            }
            // xử lí quay CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
            // Xử lí nút phát ngẫu nhiên
        randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom
                _this.isRepeat = false
                _this.setConfig('isRandom', _this.isRandom)
                _this.setConfig('isRepeat', _this.isRepeat)
                repeatBtn.classList.remove('active')
                randomBtn.classList.toggle('active')
            }
            // Xử lí nút phát lại
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                _this.isRandom = false
                _this.setConfig('isRepeat', _this.isRepeat)
                _this.setConfig('isRandom', _this.isRandom)
                repeatBtn.classList.toggle('active')
                randomBtn.classList.remove('active')
            }
            // Xử lí next/prev/ngẫu nhiên bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.randomSong()
                } else {
                    _this.prevSong()
                }
                audio.play()
            }
            // Xử lí next khi hết bài
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }
            }
            // Lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode && !e.target.closest('.option')) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                }
            }
        }
    },
    nextSong: function() {
        if (this.currentIndex < this.songs.length - 1) {
            ++this.currentIndex
        } else {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        if (this.currentIndex > 0) {
            --this.currentIndex
        } else {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.arraySong.includes(newIndex))
        this.currentIndex = newIndex
        this.inputArray()
        this.loadCurrentSong()
    },
    inputArray: function() {
        if (this.arraySong.length < this.songs.length - 1) {
            this.arraySong.push(this.currentIndex)
        } else {
            this.arraySong = []
            this.arraySong.push(this.currentIndex)
        }
    },
    // Tải config
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        this.currentIndex = this.config.currentIndex
    },
    // Tải bài hát hiện tại
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        heading2.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        this.highlightList()
        this.setConfig('currentIndex', this.currentIndex)
    },
    start: function() {
        // Định nghĩa các thuộc tính cho  object
        this.defineProperties()
            // Tải cấu hình mặc định
        this.loadConfig()
            // Cài cấu hình mặc định
        this.setBtnConfig()
            // Xử lí các sự kiện
        this.handleEvents()
            // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()
            // Render playlist
        this.render()
    },
}

app.start()