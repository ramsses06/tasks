import axios from 'axios';
/**
 *
 * @param {Array} tasks [{ name: '', description: '', duration: 'min:sec', status: '', completed_time: 0 }]
 */
export async function createTasks (tasks) {
  const responseData = await axios({
    method: 'post',
    url: 'http://167.172.141.64:3000/api/create',
    headers: {
      'Content-Type': 'application/json'
    },
    data: tasks
  });
  return responseData.data;
}
