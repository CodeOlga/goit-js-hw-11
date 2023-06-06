import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '37056848-912ded0eb5e75838ece32e5ab';
axios.defaults.baseURL = 'https://pixabay.com/api/';
BASE_URL = 'https://pixabay.com/api/';
const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');

// searchForm.addEventListener('submit', handleSubmit);

let pageToFetch = 1;
let queryToFetch = '';

//------------------1--------------------------------------
async function fetchImages(q, page) {
  try {
    const { hits } = await axios({
      params: {
        key: API_key,
        q,
        image_type: photo,
        orientation: horizontal,
        safesearch: true,
        page,
        per_page: 40,
      },
    });
    return hits;
  } catch (error) {
    console.log(error);
  }
}

//-----------------------2-------------------------------------------
// async function fetchImages(query, pageToFetch) {
//   try {
//     const response = await axios.get(
//       `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageToFetch}&per_page=40`
//     );
//     const data = response.data;
//     return data;
//   } catch (error) {
//     console.log(error.message);
//   }
// }
fetchImages('cat, 1');
