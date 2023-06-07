import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '37056848-912ded0eb5e75838ece32e5ab';
axios.defaults.baseURL = 'https://pixabay.com/api/';

//нас завжди (майже 100%) буде цікавити data з промісу, що повертається, тому деструктуризуємо
async function fetchImages(q, page) {
  try {
    const { data } = await axios({
      params: {
        key: API_KEY,
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });
    return data;
  } catch (error) {
    Notiflix.Notify.failure(
      `Ooops... Something goes wrong. Please, try again.`
    );
  }
}

export { fetchImages };
