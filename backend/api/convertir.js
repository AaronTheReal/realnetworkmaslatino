import fs from 'fs';
import mongoose from 'mongoose';
import * as cheerio from 'cheerio'; // 👈 Así se importa en ESM
import dotenv from 'dotenv';
import Noticia from '../models/Noticias.js'; // Asegúrate de que esté bien el path

dotenv.config();

// Función para convertir HTML en bloques
function htmlToBlocks(html) {
  const $ = cheerio.load(html);
  const blocks = [];

  $('body').children().each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const $el = $(el);

    if (tag === 'p') {
      const link = $el.find('a').first();
      if (link.length && $el.children().length === 1) {
        blocks.push({
          type: 'link',
          href: link.attr('href'),
          textLink: link.text(),
          tag: 'p'
        });
      } else {
        blocks.push({
          type: 'text',
          text: $el.text(),
          tag: 'p'
        });
      }

    } else if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
      blocks.push({
        type: 'text',
        text: $el.text(),
        tag
      });

    } else if (tag === 'blockquote') {
      blocks.push({
        type: 'quote',
        quote: $el.text()
      });

    } else if (tag === 'ul' || tag === 'ol') {
      const items = [];
      $el.find('li').each((_, li) => {
        items.push($(li).text());
      });
      blocks.push({
        type: 'list',
        ordered: tag === 'ol',
        items
      });

    } else if (tag === 'hr') {
      blocks.push({
        type: 'text',
        text: '---',
        tag: 'p'
      });

    } else {
      blocks.push({
        type: 'text',
        text: $el.text(),
        tag: 'p'
      });
    }
  });

  return blocks;
}

// Función principal
async function run() {
  const rawData = JSON.parse(fs.readFileSync('../api/NoticiasCambiar.json', 'utf8'));

  await mongoose.connect('mongodb+srv://aaronguapo69:X3B7D2o5jPZMgMlm@cluster0.uxax8yp.mongodb.net/RealMedia', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  for (const wp of rawData) {
    const noticia = new Noticia({
      title: wp.title.rendered,
      slug: wp.slug,
      summary: cheerio.load(wp.excerpt.rendered).text().trim(),
      originalUrl: wp.link,
      authorName: wp.yoast_head_json?.author || 'Sin autor',
      categories: wp.yoast_head_json?.articleSection || ['Mundo'],
      tags: wp.yoast_head_json?.keywords || [],
      content: htmlToBlocks(wp.content.rendered),
      meta: {
        description: wp.yoast_head_json?.description || '',
        image: wp.yoast_head_json?.og_image?.[0]?.url || ''
      },
      createdAt: new Date(wp.date),
      updatedAt: new Date(wp.modified)
    });

    try {
      await noticia.save();
      console.log(`✅ Guardada: ${noticia.slug}`);
    } catch (err) {
      console.error(`Error con ${noticia.slug}:`, err.message);
    }
  }

  mongoose.disconnect();
}

run();
