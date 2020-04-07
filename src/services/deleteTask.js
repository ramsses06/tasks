import axios from 'axios';
/**
 *
 * @param {Array} tasks [1, 5, 28]
 */
export async function deleteTask (tasks) {
  const responseData = await axios({
    method: 'delete',
    url: 'http://167.172.141.64:3000/api/delete',
    headers: {
      'Content-Type': 'application/json'
    },
    data: tasks
  });
  return responseData.data;
}
