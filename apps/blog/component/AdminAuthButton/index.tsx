'use client'

import { Button, Label, Input } from '@common-ui'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@common-ui'
import { LogIn, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const AdminAuthButton = ({ initialIsLoggedIn }: { initialIsLoggedIn: boolean }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loginInputs, setLoginInputs] = useState({ id: '', password: '' })
  const pathname = usePathname()

  const handleLogin = () => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginInputs),
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true)
          setDialogOpen(false)
          // 홈페이지(/)에 있으면 서버 컴포넌트를 다시 렌더링하기 위해 페이지 새로고침
          if (pathname === '/') {
            window.location.reload()
          }
        } else if (response.status === 401) {
          alert('아이디 또는 비밀번호가 일치하지 않습니다.')
        }
      })
      .catch((error) => {
        alert('로그인 실패: ' + error.message)
      })
  }

  const handleLogout = () => {
    fetch('/api/logout')
      .then(() => {
        setIsLoggedIn(false)
        // 홈페이지(/)에 있으면 서버 컴포넌트를 다시 렌더링하기 위해 페이지 새로고침
        if (pathname === '/') {
          window.location.reload()
        }
      })
      .catch((error) => {
        alert('로그아웃 실패: ' + error.message)
      })
  }

  const handleClickAuthBtn = () => {
    if (isLoggedIn) {
      handleLogout()
    } else {
      setDialogOpen(true)
    }
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="secondary" onClick={handleClickAuthBtn}>
            {isLoggedIn ? <LogOut /> : <LogIn />}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" onClickCloseButton={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
            <DialogDescription>관리자 계정으로 로그인하세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="id">아이디</Label>
                <Input id="id" name="id" value={loginInputs.id} onChange={handleChangeInput} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  value={loginInputs.password}
                  onChange={handleChangeInput}
                  type="password"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
