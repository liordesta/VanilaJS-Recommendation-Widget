const sinon = require('sinon');
const mockData = require('../mockData.json');

const httpMock = () => ({
  setRequestHeader: jest.fn(),
  status: 200,
  readyState: 4,
  response: JSON.stringify(mockData),
});

const url =
  'https://api.taboola.com/1.2/json/apitestaccount/recommendations.get?app.type=web&app.apikey=7be65fc78e52c11727793f68b06d782cff9ede3c&source.id=%2Fdigiday-publishing-summit%2F&source.url=https%3A%2F%2Fblog.taboola.com%2Fdigiday-publishing-summit%2F&source.type=text&placement.organic-type=mix&placement.visible=true&placement.available=true&placement.rec-count=6&placement.name=Below%20Article%20Thumbnails&placement.thumbnail.width=640&placement.thumbnail.height=480&user.session=init';
window.XMLHttpRequest = jest.fn().mockImplementation(httpMock);

describe('Recommendation Widget', () => {
  let widgetContainer, loader, server;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.respondWith('GET', url, [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(mockData),
    ]);

    widgetContainer = document.createElement('div');
    widgetContainer.id = 'recommendation__widget';
    loader = document.createElement('div');
    loader.id = 'loading';
    document.body.appendChild(loader);
    document.body.appendChild(widgetContainer);
    require('../src/js/main.js');

    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      })
    );
    server.respond();
  });

  afterEach(() => {
    document.body.removeChild(widgetContainer);
    document.body.removeChild(loader);
    server.restore();
  });

  test('Widget items should render 6 item containers', () => {
    const itemContainer =
      widgetContainer.getElementsByClassName('item__container');

    expect(itemContainer.length).toBe(6);
  });

  test('Widget items should have clickable wrapper', () => {
    const linkWrapper = widgetContainer.getElementsByClassName('linkWrapper');

    expect(linkWrapper.length).toBe(6);
  });

  test('Widget items should have href attribute', () => {
    const linkWrappers = widgetContainer.getElementsByClassName('linkWrapper');
    const links = [];

    for (let item of linkWrappers) {
      if (item.href) {
        links.push(item.href);
      }
    }

    expect(links.length).toBe(6);
  });

  test('Widget items should have correct links', () => {
    const linkWrappers = widgetContainer.getElementsByClassName('linkWrapper');
    const links = [];
    const expectedLinks = [];

    for (let i = 0; i < linkWrappers.length; i++) {
      expectedLinks.push(mockData.list[i].url);
      links.push(linkWrappers[i].href);
    }

    expect(links).toEqual(expectedLinks);
  });

  test('Widget items should have correct image src', () => {
    const thumbnailElement =
      widgetContainer.getElementsByClassName('thumbnail');
    const imgSrc = [];
    const expectedImgSrc = [];

    for (let i = 0; i < thumbnailElement.length; i++) {
      expectedImgSrc.push(mockData.list[i].thumbnail[0].url);
      imgSrc.push(
        thumbnailElement[i].style.backgroundImage
          .replace('url(', '')
          .replace(')', '')
          .replace(/\"/gi, '')
      );
    }

    expect(imgSrc).toEqual(expectedImgSrc);
  });

  test('Widget items should have correct titles', () => {
    const titleElement = widgetContainer.getElementsByClassName('title');
    const titles = [];
    const expectedTitles = [];

    for (let i = 0; i < titleElement.length; i++) {
      expectedTitles.push(mockData.list[i].name);
      titles.push(titleElement[i].innerText);
    }

    expect(titles).toEqual(expectedTitles);
  });

  test('Widget items should have correct branding name', () => {
    const brandingElement = widgetContainer.getElementsByClassName('branding');
    const brandings = [];
    const expectedBrandings = [];

    for (let i = 0; i < brandingElement.length; i++) {
      expectedBrandings.push(mockData.list[i].branding);
      brandings.push(brandingElement[i].innerText);
    }

    expect(brandings).toEqual(expectedBrandings);
  });
});
