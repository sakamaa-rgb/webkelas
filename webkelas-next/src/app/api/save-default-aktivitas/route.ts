import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ekskulList, orgList, journeyList } = body;

    const dataFilePath = path.join(process.cwd(), 'src/data/aktivitasDefaultData.json');
    const content = JSON.stringify({
      ekstrakurikulerList: Array.isArray(ekskulList) && ekskulList.length > 0 ? ekskulList : [],
      organisasiMembers: Array.isArray(orgList) && orgList.length > 0 ? orgList : [],
      journeyMilestones: Array.isArray(journeyList) && journeyList.length > 0 ? journeyList : []
    }, null, 2);

    fs.writeFileSync(dataFilePath, content, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      message: 'Data berhasil disimpan sebagai data permanen proyek!' 
    });
  } catch (error: any) {
    console.error('Failed to save aktivitas default data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
