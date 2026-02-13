
export function parseErrorHtml(html: string): string {
    if (!html || typeof html !== 'string') return 'Unknown error';


    const boldMatch = html.match(/<B>(.*?)<\/B>/i);
    if (boldMatch && boldMatch[1]) {
        return boldMatch[1];
    }


    const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
    if (bodyMatch && bodyMatch[1]) {

        return bodyMatch[1].replace(/<[^>]*>/g, '').trim();
    }


    return html.replace(/<[^>]*>/g, '').trim();
}