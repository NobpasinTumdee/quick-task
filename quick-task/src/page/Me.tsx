import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import type { Profile } from "../interface";
import '../App.css'
import './style/page.css'
import { Link } from "react-router-dom";
import Loader4 from "../component/Loader/Loader4";

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
        } catch (error: any) {
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
        return (
            <>
                <Loader4 />
            </>
        );
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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h1>Welcome✨ {userProfile?.full_name || 'unknown'} ({userProfile?.nickname || 'unknown'})</h1>
                                <Link to={'/setting'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999" style={{ cursor: 'pointer' }}>
                                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                                    </svg>
                                </Link>
                            </div>
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
