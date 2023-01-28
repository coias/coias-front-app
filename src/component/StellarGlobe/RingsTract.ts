/* eslint-disable */
/*
 * 天球を適当な矩形で分割することを考える。
 * 分割された１つの矩形をtractと呼ぶ
 * RingsTractという分割方法がここで実装されている。
 * RingsTractは 分割番号(tractId) → 分割された矩形の中心の赤経(a)、赤緯(d) を与える
 *
 * const rt = new RingsTract()
 * const [a, d] = rt.index2ad(9334) // [a, d] は tractId = 9334 の tract の中心の赤経赤緯
 *
 *
 * 元の実装はこちら
 *  https://github.com/lsst/skymap/blob/master/python/lsst/skymap/ringsSkyMap.py
 */

export class RingsTract {
  private ringSize: number
  private ringNums: number[] = [] // Number of tracts for each ring
  private numTracts: number

  constructor(readonly numRings: number = 120) {
    this.ringSize = Math.PI / (numRings + 1)
    this.numTracts = 2 // north and south polar cap
    for (let i = 0; i < numRings; ++i) {
      const t0 = this.ringSize * (i + 0.5)
      const t1 = this.ringSize * (i + 1.5)
      const numTracts = Math.floor(2 * Math.PI * Math.max(Math.sin(t0), Math.sin(t1)) / this.ringSize) + 1
      this.ringNums.push(numTracts)
      this.numTracts += numTracts
    }
  }

  d2ringIndex(d: number) {
    const t = d + Math.PI / 2
    const i = Math.floor((t / this.ringSize) - 0.5)
    return i
  }

  ij2index(i: number, j: number) {
    if (i === -1) {
      return 0
    }
    let index = 1
    for (let ii = 0; ii < i; ++ii) {
      index += this.ringNums[ii]
    }
    index += j % this.ringNums[i]
    return index
  }

  index2ij(index: number): [number, number] {
    if (index === 0) {
      return [-1, 0]
    }
    --index
    for (let i = 0; i < this.numRings; ++i) {
      if (index < this.ringNums[i]) {
        return [i, index]
      }
      index -= this.ringNums[i]
    }
    return [this.numRings + 1, 0]
  }

  index2ad(index: number): [number, number] {
    const [i, j] = this.index2ij(index)
    return this.ij2ad(i, j)
  }

  ij2ad(i: number, j: number): [number, number] {
    if (i < 0) {
      return [0, -Math.PI / 2]
    }
    const n = this.ringNums[i]
    const d = this.ringSize * (i + 1) - 0.5 * Math.PI
    const a = 2 * Math.PI * j / n
    return [a, d]
  }

  ia2j(i: number, a: number) {
    const n = this.ringNums[i]
    const deltaA = 2 * Math.PI / n
    const j = Math.floor(a / deltaA + 0.5)
    return j
  }

  ad2ij(a: number, d: number): [number, number] {
    const i = this.d2ringIndex(d)
    const j = this.ia2j(i, a)
    return [i, j]
  }

  ad2index(a: number, d: number) {
    const [i, j] = this.ad2ij(a, d)
    return this.ij2index(i, j)
  }

  tractCenters(a: number, d: number, nw: number, nh: number, cb: (a: number, d: number) => void) {
    const i = this.d2ringIndex(d)
    for (let ii = -nh; ii <= nh; ++ii) {
      const iii = i + ii
      if (iii >= 0 && iii < this.numRings) {
        const j = this.ia2j(i + ii, a)
        for (let jj = -nw; jj <= nw; ++jj) {
          const jjj = j + jj
          const [aa, dd] = this.ij2ad(iii, jjj)
          cb(aa, dd)
        }
      }
    }
  }
}
