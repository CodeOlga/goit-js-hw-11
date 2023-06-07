// import { searchForm } from './index';
// searchForm.addEventListener('submit', handleSubmit);

// function handleSubmit(e) {
//   e.preventDefault();
//   const inputValue = e.target.elements.searchQuery.value;
//   //якщо inputValue - це порожній рядок; або те значення, що зараз в inputValue - це глобальна змінни,
//   //за якою йде пошук - то виходимо з функції (щоб не слати запити на сервер при порожньому інпуті,
//   //або повторно декілька запитів за одним й тим же словом (queryToFetch))
//   if (!inputValue.trim() || inputValue === queryToFetch) {
//     return;
//   }
//   queryToFetch = inputValue;
//   pageToFetch = 1;
//   galleryContainer.innerHTML = '';
//   //знимаємо старий observer при новому запиті
//   observer.unobserve(guard);
//   getImages(queryToFetch, pageToFetch);
//   searchForm.reset();
// }
// export { handleSubmit };
