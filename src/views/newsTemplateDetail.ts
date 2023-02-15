import { News } from '../news/news.interface';
export const newsTemplateDetail = (news: News, comments) => {
  let commentsHtml = `
    <div class="card text-left mt-3">
        <div class="card-body">
          <h5 class="text-uppercase">Добавить комментарий:</h5>
          <div class="form-group">
            <label for="avatar">Выберите аватар:</label><br>
            <input type="file" id="avatar" name="avatar"><br>
          </div>
          <textarea class="text-left" id ="userComment" rows="4" cols="35" name="comment"></textarea><br>
          <button id="submit" type="button" class="btn btn-outline-dark mb-2">
            Добавить
          </button>
          <script>
            function submit() {
              const avatar = document.getElementById("avatar");
              const comment = document.getElementById("userComment");
              if (comment.value !== "" && avatar.value !== "") {
                const formdata = new FormData();
                formdata.append("text", comment.value);
                formdata.append("avatar", avatar.files[0], "http://localhost:3000/comments-static/" + avatar.value);
                const requestOptions = {
                  method: 'POST',
                  body: formdata,
                  redirect: 'follow'
                };
                fetch("http://localhost:3000/news-comments/create/?idNews=${news.id}", requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error));
              } else {
                alert("В форме создания Комментария все поля обязательны для заполнения!")
              }
            }
            document.getElementById("submit").addEventListener("click", submit);
          </script>
        </div>
        <div class="card-body">
          <h5 class="text-uppercase">Комментарии:</h5>
  `;

  if (comments != null) {
    for (const commentsItem of comments) {
      let commentsReplyHtml = `
          <div class="card-body">
            <h6 class="text-uppercase">Ответы:</h6>
        `;
      if (commentsItem?.['reply']) {
        for (const commentsItemReply of commentsItem.reply) {
          commentsReplyHtml += `
            <div class="fluid mb-2" style=" height: 50px;">
              <picture>
                <source srcset="${commentsItemReply.avatarPath}" type="image/svg+xml">
                <img src="${commentsItemReply.avatarPath}" class="float-left rounded-circle" style="width:50px;height:50px;margin-right:5px;" alt="avatar">
              </picture>
              <p>${commentsItemReply.comment}</p>
            </div>
          `;
        }

        commentsReplyHtml += `</div>`;
      }

      commentsHtml += `
      <div class="card text-left mt-3">
        <div class="card-body">
          <div class="fluid mb-2" style=" height: 50px;">
            <picture>
              <source srcset="${commentsItem.avatarPath}" type="image/svg+xml">
              <img src="${commentsItem.avatarPath}" class="float-left rounded-circle" style="width:50px;height:50px;margin-right:5px;" alt="avatar">
            </picture>
            <p>${commentsItem.comment}</p>
          </div>
          <div>
            <div class="form-group">
              <h6 class="text-uppercase">Ответить на комментарий:</h6>
              <label for="avatar">Выберите аватар:</label><br>
              <input type="file" id="avatarReply${commentsItem.id}" name="avatar"><br>
            </div>
            <textarea class="text-left" id ="userCommentReply${commentsItem.id}" rows="4" cols="35" name="comment"></textarea>
          </div>
          <button id="reply${commentsItem.id}" type="button" class="btn btn-outline-dark mb-2">
            Ответить
          </button>
          <script>
              function reply() {
                const commentReply = document.getElementById("userCommentReply${commentsItem.id}");
                const avatarReplay = document.getElementById("avatarReply${commentsItem.id}");
                if (commentReply.value !== "" && avatarReplay.value !== "") {
                  const formdata = new FormData();
                  formdata.append("text", commentReply.value);
                  formdata.append("avatar", avatarReplay.files[0], "http://localhost:3000/comments-static/" + avatarReplay.value);
                  const requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                  };
                  fetch("http://localhost:3000/news-comments/${commentsItem.id}/reply", requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                } else {
                  alert("В форме создания ответа на Комментарий все поля обязательны для заполнения!")
                }
              }
               
              document.getElementById("reply${commentsItem.id}").addEventListener("click", reply);
            </script>
            ${commentsReplyHtml}
         </div>
      </div>

      `;
    }
    commentsHtml += '</div></div>';
  } else {
    commentsHtml += `
          <h5 class="text-secondary">Для этой новости комментариев нет</h5>
        </div>
      </div>
    `;
  }

  const html = `
    <div class="card align-items-center">
      <div class="card-body">
        <h2 class="text-uppercase">${news.title}</h2>
        <h6 class="card-subtitle mb-2 text-muted">  
          Автор: ${news.author}
        </h6>
        <h6 class="card-subtitle text-muted mb-3">
          Дата создания: ${news.createdAt.toLocaleString()}
        </h6>
        <img class="img-fluid rounded" style="max-height:450px" src="${
          news.cover
        }" alt="cover news">
        <p class="card-text mt-3">${news.description}</p>
        <a href="http://localhost:3000/news">
          <button type="button" class="btn btn-dark mb-2">
            К новостям
          </button>
        </a>
      </div>
    </div>

    ${commentsHtml}
  `;

  return html;
};
