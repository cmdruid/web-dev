console.log("script.js loaded!")

const app       = document.getElementById('root'),
      logo      = document.createElement('img'),
	  container = document.createElement('div'),
	  cardCount = 9;

renderCards(cardCount);

async function fetchXKCDComic(id) {
	/*  */

  	const comicId = id ? id : '',
		  url     = `https://proxima-api.herokuapp.com/${comicId}`,
		  res     = await fetch(url);
	
	if (!(res && res.status === 200)) {
		console.log(url, res)
		throw new Error("Bad response.");
	}

  	return await res.json();
}

function generateCard(comic) {
  	/*  */

	const image = comic.imgRetina || comic.img,
		  url   = `https://xkcd.com/${comic.num}`,
		  title = comic.safe_title,
		  alt   = comic.alt,
		  date  = `${comic.month}/${comic.day}/${comic.year}`;

	const card    = document.createElement('a'),
		  div     = document.createElement('div'),
		  img     = document.createElement('img'),
		  content = document.createElement('div'),
		  header  = document.createElement('div'),
		  meta    = document.createElement('div'),
		  desc    = document.createElement('div');


	card.setAttribute('class', 'ui card raised centered');
	card.setAttribute('href', url);

	div.setAttribute('class', 'image');
	card.appendChild(div);
	
	img.setAttribute('class', 'ui image');
	img.setAttribute('src', image);
	div.appendChild(img);

	content.setAttribute('class', 'content');
	card.appendChild(content);

	header.textContent = title
	header.setAttribute('class', 'header');
	content.appendChild(header);

	meta.textContent = date;
	meta.setAttribute('class', 'meta');
	content.appendChild(meta);

	desc.setAttribute('class', 'description');
	desc.textContent = alt;
	content.appendChild(desc);

  	return card;
}

async function renderCards(numCards) {
  	/* */

  	try {
		const latestComic = await fetchXKCDComic(),
			  latestId    = latestComic.num,
			  container   = document.querySelector('#cardDeck');

      	for (let i = 0; i < numCards; i++) {
          	const comic = await fetchXKCDComic(latestId - i),
                  card  = generateCard(comic);

          	container.appendChild(card);
      	}
  	} catch(err) { console.log(err); }
}
