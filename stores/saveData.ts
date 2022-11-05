import { defineStore } from "pinia";

export const useSaveData = defineStore("saveData", () => {
  const saveData = ref<any>();
  const fileData = ref<{ name: string; encrypted: boolean }>();

  const setSaveData = (newSaveData: any) => {
    saveData.value = newSaveData;
  };

  const setFileData = (newFileData: { name: string; encrypted: boolean }) => {
    fileData.value = newFileData;
  };

  const importSave = async (data: Uint8Array) => {
    if (data[0] === 69) {
      const aesKey = await window.crypto.subtle.importKey(
        "raw",
        data.subarray(1, 17),
        {
          name: "AES-CBC",
          length: 128,
        },
        false,
        ["decrypt"]
      );

      const decrpytedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: data.subarray(17, 33),
        },
        aesKey,
        data.subarray(33)
      );

      saveData.value = JSON.parse(new TextDecoder().decode(decrpytedData));
    } else {
      saveData.value = JSON.parse(new TextDecoder().decode(data));
    }
  };

  const exportSave = async (encrypt = true): Promise<Uint8Array> => {
    if (!saveData.value) return new Uint8Array();
    let data = new TextEncoder().encode(JSON.stringify(saveData.value));

    if (encrypt) {
      const cryptoKey = await window.crypto.subtle.generateKey(
        {
          name: "AES-CBC",
          length: 128,
        },
        true,
        ["encrypt"]
      );

      const key = await window.crypto.subtle.exportKey("raw", cryptoKey);
      const iv = window.crypto.getRandomValues(new Uint8Array(16));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        cryptoKey,
        data
      );

      data = new Uint8Array(
        1 + key.byteLength + iv.byteLength + encrypted.byteLength
      );
      data.set([69]); // E
      data.set(new Uint8Array(key), 1);
      data.set(iv, 1 + key.byteLength);
      data.set(new Uint8Array(encrypted), 1 + key.byteLength + iv.byteLength);
    }

    return data;
  };

  return {
    saveData,
    fileData,
    importSave,
    exportSave,
    setSaveData,
    setFileData,
  };
});
