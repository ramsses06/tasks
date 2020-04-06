import axios from 'axios';
/**
 *
 * @param {Array} tasks [{ name: '', description: '', duration: 'min:sec', status: '', completed_time: 0 }]
 */
export async function createTasks (tasks) {
  const responseData = await axios({
    method: 'post',
    url: '/api/create',
    headers: {
      'Content-Type': 'application/json'
    },
    data: tasks
  });
  return responseData.data;
}
