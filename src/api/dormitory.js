import request from '@/utils/request'

/**
 * 获取 宿舍信息表
 * @param {*} query 
 * @returns 
 */
 export function fetchList(query) {
  return request({
    url: 'http://localhost:9528/dormitory/fetchList',
    method: 'get',
    params: query
  })
}

  export function getBuildingsByUniversityId(universityId){
    return request({
      url: 'http://localhost:9528/building/getBuildingsByUniversityId',
      method: 'get',
      params: {'universityId': universityId}
    })
  }