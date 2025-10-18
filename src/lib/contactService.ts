import { supabase } from '@/lib/supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const contactService = {
  async submitContactForm(data: { name: string; email: string; message: string }): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([data]);

      if (error) {
        console.error('Error submitting contact form:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  async deleteMessage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};
