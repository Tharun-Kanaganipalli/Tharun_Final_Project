"use server";
import supabase from "@/config/supabase-client-config";
import dayjs from "dayjs";

export const uploadFileAndGetUrl = async (file: File) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("default")
      .upload(fileName, file);
    if (error) throw new Error(error.message);

    // get the file url after uploading
    const downloadUrlResponse = supabase.storage
      .from("default")
      .getPublicUrl(fileName);

    return {
      success: true,
      data: downloadUrlResponse.data.publicUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
