import { News } from '../news/news.interface';

const blockCreateNews = `
  <div class="card text-center mt-3">
    <h3 class="text-uppercase mt-4">Создайте свою новость</h3>
    <div class="card-body text-left mx-auto">
      <div>
        <div class="form-group">
          <label for="cover">Выберите изображение анонса:</label><br>
          <input type="file" id="cover" name="cover"><br>
        </div>
        <input type="text" class="form-control mb-2" id="title" name="title" aria-describedby="title" placeholder="Введите название новости">
        <input type="text" class="form-control mb-2" id="author" name="author" aria-describedby="author" placeholder="Введите ФИО автора">
        <textarea class="form-control text-left" id="description" rows="4" cols="50" name="description" placeholder="Введите текст новости"></textarea><br>
        <button id="btnCreateNews" class="btn btn-dark mb-3">Создать новость</button>
      </div>
      <script>
        function createNews() {
          const cover = document.getElementById("cover");
          const title = document.getElementById("title");
          const author = document.getElementById("author");
          const description = document.getElementById("description");

          if (cover.value !== "" && author.value !== "" && title.value !== "" && description.value !== "") {
            const formdata = new FormData();
            formdata.append("title", title.value);
            formdata.append("description", description.value);
            formdata.append("author", author.value);
            formdata.append("cover", cover.files[0], "http://localhost:3000/news-static/" + cover.value);
            const requestOptions = {
              method: 'POST',
              body: formdata,
              redirect: 'follow'
            };
            fetch("http://localhost:3000/news/create", requestOptions)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
           } else {
            alert("В форме создания Новости все поля обязательны для заполнения!")
          }
        }
        document.getElementById("btnCreateNews").addEventListener("click", createNews);
      </script>
    </div>
  </div>
`;

export const newsTemplate = (news: News[]) => {
  if (news?.length === 0) {
    return emptyNews();
  }

  let html = `
    <h1 class="text-uppercase mb-5">Новости</h1><div class="row">
  `;
  for (const newsItem of news) {
    html += `
      <div class="col-lg-6 mb-3">
        <div class="card align-items-center">
          <div class="card-body">
            <h5 class="card-title">${newsItem.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">  
              Автор: ${newsItem.author}
            </h6>
            <h6 class="card-subtitle mb-2 text-muted">
              Дата создания: ${newsItem.createdAt.toLocaleString()}
            </h6>
            <picture>
              <source srcset="${newsItem.cover}" type="image/svg+xml">
              <img src="${
                newsItem.cover
              }" class="img-fluid rounded" style="max-height:250px" alt="cover news">
            </picture>
            <p class="card-text">${newsItem.description}</p>
          </div>
          <a href="http://localhost:3000/news/${newsItem.id}/detail">
            <button type="button" class="btn btn-dark mb-4">
              Читать далее
            </button>
          </a>
        </div>
      </div>
    `;
  }
  html += `</div> ${blockCreateNews}`;
  return html;
};

const emptyNews = () => {
  return `
    <h1 class="text-uppercase">Новости</h1>
    <h4 class="text-secondary">Список новостей пуст!</h4>
    ${blockCreateNews}
  `;
};
