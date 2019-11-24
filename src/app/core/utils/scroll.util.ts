export function isScrollToBottom(element) {
  const scrollHeight = element.scrollHeight;
  const scrollTop = element.scrollTop;
  const height = element.clientHeight;
  if (scrollTop + height >= scrollHeight) {
    console.log('滚动条到底部了');
    return true;
  } else {
    return false;
  }
}
