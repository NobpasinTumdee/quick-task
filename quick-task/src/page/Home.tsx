import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import type { Profile } from "../interface";
import '../App.css'


const Home = () => {
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Profile>({
        id: '',
        full_name: '',
        first_name: '',
        last_name: '',
        nickname: '',
        age: 0,
        avatar_url: '',
    });

    useEffect(() => {
        handleUserInfo();
    }, []);

    const handleUserInfo = async () => {
        try {
            const { data: { user: userFromSupabase } } = await supabase.auth.getUser()
            // console.table(userFromSupabase);
            if (userFromSupabase) {
                setUser(userFromSupabase);
            }
        } catch (error) {
            console.error("Error getting user:", error);
        }
    }

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    const getProfile = async () => {
        try {
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`*`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }
            // console.table(data);
            if (data) {
                setUserProfile(data);
                setFormData(data);
                setLoading(false);
            }


        } catch (error: any) {
            console.error('Error fetching profile:', error.message);
        }
    };

    // (โค้ด uploadAvatar และ updateProfile)
    const uploadAvatar = async (event: any) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. แก้ไขให้ใช้ upsert: true เพื่อให้อัปโหลดไฟล์ชื่อซ้ำได้
            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    contentType: 'image/jpeg',
                    upsert: true,
                });

            if (uploadError) {
                throw uploadError;
            }

            // 2. รับ public URL ของรูปภาพ
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. นำ URL ที่ได้ไปตั้งค่า state
            setFormData({ ...formData, avatar_url: data.publicUrl });
            await updateProfile();

        } catch (error: any) {
            console.error('Error uploading avatar:', error.message);
        } finally {
            setUploading(false);
        }
    };

    const updateProfile = async () => {
        try {
            const updates = {
                id: user.id,
                full_name: formData.full_name,
                first_name: formData.first_name,
                last_name: formData.last_name,
                nickname: formData.nickname,
                age: formData.age,
                avatar_url: formData.avatar_url,
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) {
                throw error;
            }

            alert('อัปเดตข้อมูลสำเร็จ!');
        } catch (error: any) {
            console.error('Error updating profile:', error.message);
        }
    };


    if (!user) {
        return <div>กำลังตรวจสอบสิทธิ์...</div>;
    }

    return (
        <>
            <h1>Home</h1>
            <div>
                <h1>ยินดีต้อนรับ {userProfile?.full_name}!</h1>
                <p>gmail : {user.email}</p>
                <p>ID: {user.id}</p>
                <p>คุณได้เข้าถึงหน้า Protected Page แล้ว</p>
            </div>
            <div>
                <h2>ข้อมูลส่วนตัว</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {userProfile?.avatar_url && (
                            <img src={userProfile?.avatar_url} alt="Avatar" style={{ width: '150px', borderRadius: '50%' }} />
                        )}
                        <div>
                            <label htmlFor="avatar">รูปโปรไฟล์</label>
                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                onChange={uploadAvatar}
                                disabled={uploading}
                            />
                        </div>
                        <div>
                            <label htmlFor="fullName">ชื่อจริง</label>
                            <input
                                id="fullName"
                                type="text"
                                value={formData.full_name || ''}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="firstName">ชื่อ</label>
                            <input
                                id="firstName"
                                type="text"
                                value={formData.first_name || ''}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">นามสกุล</label>
                            <input
                                id="lastName"
                                type="text"
                                value={formData.last_name || ''}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="nickname">ชื่อเล่น</label>
                            <input
                                id="nickname"
                                type="text"
                                value={formData.nickname || ''}
                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="age">อายุ</label>
                            <input
                                id="age"
                                type="number"
                                value={formData.age || ''}
                                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                            />
                        </div>
                        <button onClick={updateProfile} disabled={uploading}>
                            {uploading ? 'กำลังอัปโหลด...' : 'บันทึกข้อมูล'}
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default Home;
