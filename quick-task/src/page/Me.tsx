import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import type { Profile } from "../interface";
import '../App.css'
import './style/page.css'


const Me = () => {
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [Popup, setPopup] = useState(false);
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

            if (status === 406) {
                setLoading(false);
                return;
            }
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

            // console.log(data.publicUrl);
            await AvataUpdatePicture(data.publicUrl);

            // 3. นำ URL ที่ได้ไปตั้งค่า state
            setFormData({ ...formData, avatar_url: data.publicUrl });

        } catch (error: any) {
            console.error('Error uploading avatar:', error.message);
        } finally {
            setUploading(false);
        }
    };

    const AvataUpdatePicture = async (url: string) => {
        // console.log(url);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: url })
                .eq('id', user.id)

            if (error) {
                throw error;
            }
            await getProfile();
            alert('อัปเดตข้อมูลสำเร็จ!');
        } catch (error:any) {
            console.error('Error updating profile:', error.message);
        }
    }

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
            await getProfile();
        } catch (error: any) {
            console.error('Error updating profile:', error.message);
        }
    };


    if (!user) {
        return <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>กำลังตรวจสอบสิทธิ์...</h1>;
    }

    return (
        <>
            <div className="me-container">
                <div className="background-me" >
                    {userProfile?.avatar_url ? (
                        <img src={userProfile?.avatar_url} alt="Avatar" className="avatar-me" />
                    ) : (
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Avatar" className="avatar-me" />
                    )}
                </div>
                <div className="me-welcome">
                    {loading ? (
                        <h1 style={{ textAlign: 'center' }}>Loading...</h1>
                    ) : (
                        <>
                            <h1>Welcome✨ {userProfile?.full_name || 'unknown'} ({userProfile?.nickname || 'unknown'})</h1>
                            <p>ID: {user.id}</p>
                            <p>Full Name : {userProfile?.full_name || 'unknown'}</p>
                            <p>Name : {userProfile?.first_name || 'unknown first name'} {userProfile?.last_name || 'unknown last name'}</p>
                            <p>gmail : {user.email}</p>
                            <p>Age : {userProfile?.age || 'unknown'}</p>
                            <h2 className="edit-profile" onClick={() => setPopup(!Popup)}>Edit profile</h2>
                        </>
                    )}
                </div>

                <div className="me-form">
                    {loading ? (
                        <h2 style={{ textAlign: 'center' }}>Loading...</h2>
                    ) : (
                        <>
                            {Popup &&
                                <>
                                    {/* <div className="overlay" onClick={() => setPopup(!Popup)} /> */}
                                    <div className="form-container">
                                        <h2 className="form-title">Edit profile</h2>
                                        <img src={userProfile?.avatar_url} width={50} height={50} alt="" />
                                        <div className="form-group">
                                            <label htmlFor="avatar">Avatar</label>
                                            <input
                                                type="file"
                                                id="avatar"
                                                accept="image/*"
                                                onChange={uploadAvatar}
                                                disabled={uploading}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="fullName">Full Name</label>
                                            <input
                                                id="fullName"
                                                type="text"
                                                value={formData.full_name || ""}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, full_name: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input
                                                id="firstName"
                                                type="text"
                                                value={formData.first_name || ""}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, first_name: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input
                                                id="lastName"
                                                type="text"
                                                value={formData.last_name || ""}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, last_name: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nickname">ชื่อเล่น</label>
                                            <input
                                                id="nickname"
                                                type="text"
                                                value={formData.nickname || ""}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, nickname: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="age">อายุ</label>
                                            <input
                                                id="age"
                                                type="number"
                                                value={formData.age || ""}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, age: Number(e.target.value) })
                                                }
                                            />
                                        </div>

                                        <button
                                            className="submit-btn"
                                            onClick={updateProfile}
                                            disabled={uploading}
                                        >
                                            {uploading ? "กำลังอัปโหลด..." : "บันทึกข้อมูล"}
                                        </button>
                                    </div>
                                </>
                            }
                        </>
                    )}
                </div>
            </div>
            <div className="me-container mobile-error">
                <p>ไม่รองรับขนาดจอนี้</p>
                <p>โปรดเปลี่ยนขนาดจอ หรืออุปกรณ์</p>
            </div>
        </>
    );
};

export default Me;
