// import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import { renderGallery } from './renderGallery';

// const API_KEY = '37056848-912ded0eb5e75838ece32e5ab';
// axios.defaults.baseURL = 'https://pixabay.com/api/';
const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

searchForm.addEventListener('submit', handleSubmit);

let pageToFetch = 1;
let queryToFetch = '';

//плавне прокручування сторінки
// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

//Нескінченний скрол. Створюємо екземпляр класу IntersectionObserver (він вбудований в JS)
//назва змінної може буть будь-яка
//entries - це массив з точок, за якими слідкуємо(ціль), по факту це масив з одного елемента(не питати чому)
//entry - це точка, елемент за яким я слідкую
//перевіряємо: якщо entry відслідковується (isIntersecting - метод вбудований) - викликаємо функцію getImages
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        getImages(queryToFetch, pageToFetch);
      }
    });
  },
  { rootMargin: '200px' }
);

//нас завжди (майже 100%) буде цікавити data з промісу, що повертається, тому деструктуризуємо
// async function fetchImages(q, page) {
//   try {
//     const { data } = await axios({
//       params: {
//         key: API_KEY,
//         q,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         page,
//         per_page: 40,
//       },
//     });
//     return data;
//   } catch (error) {
//     Notiflix.Notify.failure(
//       `Oooops... Something goes wrong. Please, try again.`
//     );
//   }
// }

async function getImages(query, page) {
  const data = await fetchImages(query, page);
  //якщо користувач ввів абракадабру (немає картинок з таким запитом)
  if (!data.totalHits) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }
  console.log(data);
  const photos = data.hits;
  renderGallery(photos);

  const gallery = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });

  if (pageToFetch === 1) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  // if (data.totalHits >= pageToFetch * 40) {
  //   // observer.unobserve(guard);
  //   Notiflix.Notify.info(
  //     `We're sorry, but you've reached the end of search results.`
  //   );
  // }

  pageToFetch += 1;
  //викликаємо observer на ньому вбудований метод observe.
  //(guard) - це той елемент, за яким буде відбуватися слідкування, він піде в entry;
  observer.observe(guard);
  gallery.refresh();
}

// function renderGallery(photos) {
//   const markup = photos
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<a class="link-card" href="${largeImageURL}">
//                   <div class="photo-card">
//                   <img src='${webformatURL}' alt='${tags}' loading="lazy" />
//                   <div class="info">
//                     <p class="info-item">
//                       <b>Likes</b>${likes}
//                     </p>
//                     <p class="info-item">
//                       <b>Views</b>${views}
//                     </p>
//                     <p class="info-item">
//                       <b>Comments</b>${comments}
//                     </p>
//                     <p class="info-item">
//                       <b>Downloads</b>${downloads}
//                     </p>
//                   </div>
//                 </div>
//                 </a>`;
//       }
//     )
//     .join('');
//   galleryContainer.insertAdjacentHTML('beforeend', markup);
// }

function handleSubmit(e) {
  e.preventDefault();
  const inputValue = e.target.elements.searchQuery.value;
  //якщо inputValue - це порожній рядок; або те значення, що зараз в inputValue - це глобальна змінни,
  //за якою йде пошук - то виходимо з функції (щоб не слати запити на сервер при порожньому інпуті,
  //або повторно декілька запитів за одним й тим же словом (queryToFetch))
  if (!inputValue.trim() || inputValue === queryToFetch) {
    return;
  }
  queryToFetch = inputValue;
  pageToFetch = 1;
  galleryContainer.innerHTML = '';
  //знимаємо старий observer при новому запиті
  observer.unobserve(guard);
  getImages(queryToFetch, pageToFetch);
  searchForm.reset();
}

export { galleryContainer };
