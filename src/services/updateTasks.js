import axios from 'axios';
/**
 *
 * @param {Array} tasks [{ id: 1, name: '', description: '', duration: 'min:sec', status: '', completed_time: 0 }]
 */
export async function updateTasks (tasks) {
  const responseData = await axios({
    method: 'put',
    url: 'http://167.172.141.64:3000/api/update',
    headers: {
      'Content-Type': 'application/json'
    },
    data: tasks
  });
  return responseData.data;
}
