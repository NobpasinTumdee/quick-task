// src/components/Home.tsx (โค้ดที่แก้ไขแล้ว)
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import '../App.css'

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [age, setAge] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log(`Auth event: ${event}`);
                if (session) {
                    setUser(session.user);
                } else {
                    console.log('please login');
                    navigate('/login');
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    // แก้ไข: useEffect ที่เรียก getProfile จะต้องมีเงื่อนไข user.id
    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    const getProfile = async () => {
        try {
            // ... (โค้ด getProfile เหมือนเดิม)
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, nickname, age, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setFullName(data.full_name);
                setNickname(data.nickname);
                setAge(data.age);
                setAvatarUrl(data.avatar_url);
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
            setAvatarUrl(data.publicUrl);
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
                full_name: fullName,
                nickname: nickname,
                age: age,
                avatar_url: avatarUrl,
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
                <h1>ยินดีต้อนรับ {fullName}!</h1>
                <p>gmail : {user.email}</p>
                <p>ID: {user.id}</p>
                <p>คุณได้เข้าถึงหน้า Protected Page แล้ว</p>
            </div>
            <div>
                <h2>ข้อมูลส่วนตัว</h2>
                {avatarUrl && (
                    <img src={avatarUrl} alt="Avatar" style={{ width: '150px', borderRadius: '50%' }} />
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
                        value={fullName || ''}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="nickname">ชื่อเล่น</label>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname || ''}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="age">อายุ</label>
                    <input
                        id="age"
                        type="number"
                        value={age || ''}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>
                <button onClick={updateProfile} disabled={uploading}>
                    {uploading ? 'กำลังอัปโหลด...' : 'บันทึกข้อมูล'}
                </button>
            </div>
        </>
    );
};

export default Home;