function initApp() {
  var request = new XMLHttpRequest(),
    method = 'GET',
    url =
      'https://api.taboola.com/1.2/json/apitestaccount/recommendations.get?app.type=web&app.apikey=7be65fc78e52c11727793f68b06d782cff9ede3c&source.id=%2Fdigiday-publishing-summit%2F&source.url=https%3A%2F%2Fblog.taboola.com%2Fdigiday-publishing-summit%2F&source.type=text&placement.organic-type=mix&placement.visible=true&placement.available=true&placement.rec-count=6&placement.name=Below%20Article%20Thumbnails&placement.thumbnail.width=640&placement.thumbnail.height=480&user.session=init';

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      document.getElementById('loading').style.display = 'none';
      var response = JSON.parse(request.response);
      var data = response.list;
      data.forEach(function (item) {
        createItemElement(item);
      });
    }
  };
  request.open(method, url, true);
  request.send();
}

function createItemElement(item) {
  var widgetContainer = document.getElementById('recommendation__widget');
  var itemContainer = document.createElement('div');
  var thumbnail = document.createElement('div');
  var infoContainer = document.createElement('div');
  var title = document.createElement('span');
  var branding = document.createElement('span');
  var seperator = document.createElement('div');
  var category = document.createElement('span');
  var linkWrapper = document.createElement('a');

  itemContainer.className = 'item__container';
  thumbnail.className = 'thumbnail';
  infoContainer.className = 'info__container';
  title.className = 'title';
  branding.className = 'branding';
  seperator.className = 'seperator';
  category.className = 'category';
  linkWrapper.className = 'linkWrapper';

  thumbnail.style.backgroundImage = 'url(' + item.thumbnail[0].url + ')';
  title.innerText = item.name;
  branding.innerText = item.branding;
  linkWrapper.href = item.url;
  linkWrapper.target = '_blank';

  infoContainer.appendChild(title);
  infoContainer.appendChild(branding);
  if (item.categories && item.categories.length > 0) {
    category.innerText = item.categories[0];
    infoContainer.appendChild(seperator);
    infoContainer.appendChild(category);
  }
  linkWrapper.appendChild(thumbnail);
  linkWrapper.appendChild(infoContainer);
  itemContainer.appendChild(linkWrapper);
  widgetContainer.appendChild(itemContainer);
}

document.addEventListener('DOMContentLoaded', initApp);
