import axios from 'axios';

async function GetProgress(setProgress, currentQuery) {
  const uri = process.env.REACT_APP_API_URI;
  const queryList = [
    'preprocess',
    'startsearch2R',
    'prempsearchC-before',
    'prempsearchC-after',
    'astsearch_new',
    'AstsearchR_afterReCOIAS',
    'initial',
    'N/A',
  ];
  let readQuery;
  let readProgress;
  // currentQueryをチェック
  if (!queryList.includes(currentQuery)) {
    setProgress('error:invalid currentQuery');
    return;
  }
  // ${uri}progressにアクセスして進捗率を読み込む
  await axios
    .get(`${uri}progress`)
    .then((response) => response.data.result)
    .then((result) => {
      readQuery = result.query;
      readProgress = result.progress;

      // readQueryをチェック
      if (!queryList.includes(readQuery)) {
        setProgress('error:invalid readQuery');
        return;
      }

      // currentQueryとreadQueryがあっているかチェック
      // 処理が切り替わった瞬間はcurrentQueryがreadQueryに先行している可能性がある
      // この2つが異なっている場合処理が切り替わった直後だと考えられるので, 進捗率0%にする
      if (currentQuery !== readQuery) {
        readProgress = '0%';
      }

      // 進捗率セット
      setProgress(readProgress);
    })
    .catch(() => {
      console.log('GetProgress関数内でエラーが発生しました');
    });
}

export default GetProgress;
