import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import { renderGallery } from './renderGallery';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

searchForm.addEventListener('submit', handleSubmit);

let pageToFetch = 1;
let queryToFetch = '';

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

//бібліотека
const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

async function getImages(query, page) {
  const data = await fetchImages(query, page);

  //якщо користувач ввів абракадабру (немає картинок з таким запитом)
  if (!data.totalHits) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }

  const photos = data.hits;
  renderGallery(photos);

  //на першій сторінці
  if (pageToFetch === 1) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  //завершення колекції
  const totalPagesPerSubmit = Math.ceil(data.totalHits / 40);

  if (pageToFetch === totalPagesPerSubmit) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    observer.unobserve(guard);
  }

  pageToFetch += 1;

  //викликаємо observer на ньому вбудований метод observe.
  //(guard) - це той елемент, за яким буде відбуватися слідкування, він піде в entry;
  observer.observe(guard);

  //викликаємо метод refresh бібліотеки simplelightbox після оновлення DOM
  gallery.refresh();
}

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
  gallery.refresh();
  searchForm.reset();
}

export { galleryContainer };
