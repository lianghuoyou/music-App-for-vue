import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url, newurl}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.newurl = newurl
  }
  getLyric() {
  	if (this.lyric) {
  		return Promise.resolve(this.lyric)
  	}
  	return new Promise((resolve, reject) => {
  		getLyric(this.mid).then((res) => {
  			if (res.retcode === ERR_OK) {
  				this.lyric = Base64.decode(res.lyric)
  				resolve(this.lyric)
  			} else {
  				reject(new Error('no lyric'))
  			}
  		})
  	})
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
    newurl: `http://110.100.10.1/IXC0edc449dc426c3f67beb38380fe0c836/${musicData.songmid}.m4a?guid=4463044170&vkey=BBEF2D0929C920D9B40C212B4AA91DD884D6696E9D3E46473D0CF22ED81702C35D9DC177B18ED8716C003EE9B45F175B98B4061D7E412B11&uin=3736&fromtag=999`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
