import axios from 'axios';
/**
 *
 * @param {object} opts {
 *    field: 'campo',
 *    range: [ val1, val2 ],
 *    query: { campo: valor }
 * }
 */
export async function getTasksFiltered (opts) {
  const responseData = await axios({
    method: 'post',
    url: 'http://167.172.141.64:3000/api/filtered',
    headers: {
      'Content-Type': 'application/json'
    },
    data: opts
  });
  return responseData.data;
}
